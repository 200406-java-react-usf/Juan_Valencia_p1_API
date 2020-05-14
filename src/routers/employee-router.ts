import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import { adminGuard } from '../middleware/auth-middleware';

export const EmployeeRouter = express.Router();

const employeeService = AppConfig.employeeService;

EmployeeRouter.get('', adminGuard, async (req, resp) => {
    try {

            let payload = await employeeService.getAllEmployees();
            return resp.status(200).json(payload);

    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});

EmployeeRouter.get('/:id', adminGuard, async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await employeeService.getEmployeeById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

EmployeeRouter.post('', adminGuard, async (req, resp) => {

    console.log('POST REQUEST RECEIVED AT /users');
    console.log(req.body);
    try {
        let newUser = await employeeService.addNewEmployee(req.body);
        return resp.status(201).json(newUser);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

EmployeeRouter.put('', adminGuard, async (req, resp) => {

    console.log('PUT REQUEST RECEIVED AT /users');
    console.log(req.body);
    try {
        let newUser = await employeeService.updateEmployee(req.body);
        return resp.status(201).json(newUser).send();
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }

});