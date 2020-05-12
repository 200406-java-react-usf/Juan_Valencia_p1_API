import { EmployeeRepository } from "../repos/employee-repo";
import { EmployeeService } from "../services/employee-service";

const employeeRepo = new EmployeeRepository();
const employeeService = new EmployeeService(employeeRepo);


export default {
    employeeService
}