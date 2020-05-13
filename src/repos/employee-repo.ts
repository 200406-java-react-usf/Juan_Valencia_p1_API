import { Employee } from '../models/employee';
import { CrudRepository } from './crud-repo';
import {
    NotImplementedError, 
    ResourceNotFoundError, 
    ResourcePersistenceError,
    InternalServerError
} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapEmployeeResultSet } from '../util/result-set-mapper';

export class EmployeeRepository implements CrudRepository<Employee> {

    baseQuery = `
        select
            eu.ers_user_id, 
            eu.username, 
            eu.password, 
            eu.first_name,
            eu.last_name,
            eu.email,
            ur.role_name as role
        from ers_users eu
        join ers_user_roles ur
        on eu.user_role_id = ur.role_id
    `;

    async getById(id: number): Promise<Employee> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where eu.ers_user_id = $1`;
            let rs = await client.query(sql, [id]);
            return mapEmployeeResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    

    }

    async getEmployeeByCredentials(un: string, pw: string): Promise<Employee> {
        
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where eu.username = $1 and eu.password = $2`;
            let rs = await client.query(sql, [un, pw]);
            return mapEmployeeResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    async save(newEmployee: Employee): Promise<Employee> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();

            // WIP: hacky fix since we need to make two DB calls
            let roleId = (await client.query('select role_id from ers_user_roles where role_name = $1', [newEmployee.role])).rows[0].userId;
            
            let sql = `
                insert into ers_users (username, password, first_name, last_name, email, user_role_id) 
                values ($1, $2, $3, $4, $5, $6) returning id
            `;

            let rs = await client.query(sql, [newEmployee.username, newEmployee.password, newEmployee.firstName, newEmployee.lastName, newEmployee.email, roleId]);
            
            newEmployee.userId = rs.rows[0].userId;
            
            return newEmployee;

        } catch (e) {
            console.log(e);
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async update(updateEmployee: Employee): Promise<boolean> {
        return
    }

    async getEmployeeByUniqueKey(key: string, val: string): Promise<Employee> {

        let client: PoolClient;

        try {

            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where eu.${key} = $1`;
            let rs = await client.query(sql, [val]);
            console.log(rs.rows);
            return mapEmployeeResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
        
    
    }
}