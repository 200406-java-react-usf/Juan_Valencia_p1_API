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

    private removePassword(employee: Employee): Employee {
        if(!employee || !employee.password) return employee;
        let emply = {...employee};
        delete emply.password;
        return emply;   
    }
}