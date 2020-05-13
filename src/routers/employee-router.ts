import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import { adminGuard } from '../middleware/auth-middleware';

export const EmployeeRouter = express.Router();

const employeeService = AppConfig.employeeService;

EmployeeRouter.get('/:id', adminGuard, async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await employeeService.getEmployeeById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

EmployeeRouter.post('', async (req, resp) => {

    console.log('POST REQUEST RECEIVED AT /users');
    console.log(req.body);
    try {
        let newUser = await employeeService.addNewEmployee(req.body);
        return resp.status(201).json(newUser);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});