import { EmployeeSchema, ReimbSchema } from "./schemas";
import { Employee } from "../models/employee";
import { Reimbursement } from "../models/reimbursement";

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

export function mapReimbResultSet(resultSet: ReimbSchema): Reimbursement {
    
    if (!resultSet) {
        return {} as Reimbursement;
    }

    return new Reimbursement(
        resultSet.reimb_id,
        resultSet.amount,
        resultSet.submitted,
        resultSet.resolved,
        resultSet.description,
        resultSet.author,
        resultSet.resolver,
        resultSet.reimb_status,
        resultSet.reimb_type
    );
}