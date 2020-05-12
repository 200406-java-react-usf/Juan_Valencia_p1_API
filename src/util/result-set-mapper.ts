import { EmployeeSchema } from "./schemas";
import { Employee } from "../models/employee";

export function mapEmployeeResultSet(resultSet: EmployeeSchema): Employee {
    
    if (!resultSet) {
        return {} as Employee;
    }

    return new Employee(
        resultSet.ers_user_id,
        resultSet.username,
        resultSet.password,
        resultSet.first_name,
        resultSet.last_name,
        resultSet.email,
        resultSet.role
    );
}