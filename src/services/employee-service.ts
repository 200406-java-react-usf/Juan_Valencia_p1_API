import { Employee } from "../models/employee";
import { EmployeeRepository } from "../repos/employee-repo";
import { isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject } from "../util/validator";
import { 
    BadRequestError, 
    ResourceNotFoundError, 
    NotImplementedError, 
    ResourcePersistenceError, 
    AuthenticationError 
} from "../errors/errors";


export class EmployeeService {

    constructor(private employeeRepo: EmployeeRepository) {
        this.employeeRepo = employeeRepo;
    }

    async getEmployeeById(id: number): Promise<Employee> {

        if (!isValidId(id)) {
            throw new BadRequestError();
        }

        let employee = await this.employeeRepo.getById(id);

        if (isEmptyObject(employee)) {
            throw new ResourceNotFoundError();
        }

        return this.removePassword(employee);

    }

    async authenticateEmployee(un: string, pw: string): Promise<Employee> {

        try {

            if (!isValidStrings(un, pw)) {
                throw new BadRequestError();
            }

            let authEmployee: Employee;
            
            authEmployee = await this.employeeRepo.getEmployeeByCredentials(un, pw);
           

            if (isEmptyObject(authEmployee)) {
                throw new AuthenticationError('Bad credentials provided.');
            }

            return this.removePassword(authEmployee);

        } catch (e) {
            throw e;
        }

    }

    async addNewEmployee(newEmployee: Employee): Promise<Employee> {
        if (!isValidObject(newEmployee, 'id')) {
            throw new BadRequestError('Invalid property values found in provided user.');
        }

        let usernameAvailable = await this.isUsernameAvailable(newEmployee.username);

        if (!usernameAvailable) {
            throw new ResourcePersistenceError('The provided username is already taken.');
        }
    
        let emailAvailable = await this.isEmailAvailable(newEmployee.email);

        if (!emailAvailable) {
            throw new  ResourcePersistenceError('The provided email is already taken.');
        }

        newEmployee.role = 'User'; // all new registers have 'User' role by default
        const persistedUser = await this.employeeRepo.save(newEmployee);

        return this.removePassword(persistedUser);
    }

    async updateEmployee(updateEmployee: Employee): Promise<boolean> {
        return
    }

    async getEmployeeByUniqueKey(queryObj: any): Promise<Employee> {

        // we need to wrap this up in a try/catch in case errors are thrown for our awaits
        try {

            let queryKeys = Object.keys(queryObj);

            if(!queryKeys.some(key => isPropertyOf(key, Employee))) {
                throw new BadRequestError();
            }

            // we will only support single param searches (for now)
            let key = queryKeys[0];
            let val = queryObj[key];

            // if they are searching for a user by id, reuse the logic we already have
            if (key === 'id') {
                return await this.getEmployeeById(+val);
            }

            // ensure that the provided key value is valid
            if(!isValidStrings(val)) {
                throw new BadRequestError();
            }

            let user = await this.employeeRepo.getEmployeeByUniqueKey(key, val);

            if (isEmptyObject(user)) {
                throw new ResourceNotFoundError();
            }

            return this.removePassword(user);

        } catch (e) {
            throw e;
        }
    }

    private removePassword(employee: Employee): Employee {
        if(!employee || !employee.password) return employee;
        let emply = {...employee};
        delete emply.password;
        return emply;   
    }

    private async isUsernameAvailable(username: string): Promise<boolean> {

        try {
            await this.getEmployeeByUniqueKey({'username': username});
        } catch (e) {
            console.log('username is available')
            return true;
        }

        console.log('username is unavailable')
        return false;

    }

    private async isEmailAvailable(email: string): Promise<boolean> {
        
        try {
            await this.getEmployeeByUniqueKey({'email': email});
        } catch (e) {
            console.log('email is available')
            return true;
        }

        console.log('email is unavailable')
        return false;
    }
}