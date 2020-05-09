import url from 'url';
import express from 'express';
import AppConfig from '../config/app';

export const UserRouter = express.Router();

const userService = AppConfig.userService;

UserRouter.get('/:id', async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await userService.getUserById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});