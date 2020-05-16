import { EmployeeRepository } from "../repos/employee-repo";
import { EmployeeService } from "../services/employee-service";
import { ReimbService } from "../services/reimb-service";
import { ReimbRepository } from "../repos/reimb-repo";

const employeeRepo = new EmployeeRepository();
const employeeService = new EmployeeService(employeeRepo);

const reimbRepo = new ReimbRepository();
const reimbService = new ReimbService(reimbRepo);


export default {
    employeeService,
    reimbService
}