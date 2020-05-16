import {
    InternalServerError
} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapReimbResultSet, mapTypeResultSet } from '../util/result-set-mapper';
import { Reimbursement } from '../models/reimbursement';

export class ReimbRepository {

    baseQuery = `
    select r.reimb_id,
    r.amount,
    r.submitted,
    r.resolved,
    r.description,
    us.username as author,
    ue.username as resolver,
    rs.reimb_status as status,
    rt.reimb_type as type
    from ers_reimbursements r 
        join ers_users us on us.ers_user_id = r.author_id
        left join ers_users ue on ue.ers_user_id = r.resolver_id 
        join ers_reimbursement_statuses rs on rs.reimb_status_id = r.reimb_status_id 
        join ers_reimbursement_types rt on rt.reimb_type_id = r.reimb_type_id
    `;

    async getAll(): Promise<Reimbursement[]> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery}`;
            let rs = await client.query(sql); 
            return rs.rows.map(mapReimbResultSet);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }

    }

    async getReimbsByStatus(status: string): Promise<Reimbursement[]> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where rs.reimb_status = $1;`;
            let rs = await client.query(sql,[status]); 
            return rs.rows.map(mapReimbResultSet);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async getReimbsByType(type: string): Promise<Reimbursement[]> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where rt.reimb_type = $1 ;`;
            let rs = await client.query(sql,[type]); 
            return rs.rows.map(mapReimbResultSet);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async getTypes(): Promise<any[]> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `select reimb_type from ers_reimbursement_types;`;
            let rs = await client.query(sql); 
            return rs.rows.map(mapTypeResultSet);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }

    }

    async getById(id: number): Promise<Reimbursement> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where r.reimb_id = $1 ;`;
            let rs = await client.query(sql, [id]);
            return mapReimbResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    

    }

    async getByAuthorId(id: number): Promise<Reimbursement> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where r.author_id = $1 ;`;
            let rs = await client.query(sql, [id]);
            return mapReimbResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    

    }

}