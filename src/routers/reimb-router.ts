import express from 'express';
import AppConfig from '../config/app';
import { adminGuard, fmGuard, userGuard, generalGuard } from '../middleware/auth-middleware';
import { AuthorizationError } from '../errors/errors';

export const ReimbRouter = express.Router();

const reimbService = AppConfig.reimbService;

/**
 * Get all Reimbursements(Only visible to finance manager)
 */
ReimbRouter.get('/fm', fmGuard, async (req, resp) => {
    try {

            let payload = await reimbService.getAllReimb();
            return resp.status(200).json(payload);

    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});

// /**
//  * Get Reimbursements by Status(Only visible to finance manager)
//  */
// ReimbRouter.get('/fm/status/:status', fmGuard, async (req, resp) => {
//     const status = req.params.status;
//     console.log(status);
//     try {

//         let payload = await reimbService.getReimbByStatus(status);
//         return resp.status(200).json(payload);
//     } catch (e) {
//         return resp.status(e.statusCode).json(e);
//     }
// });

// /**
//  * Get Reimbursements by Type(Only visible to finance manager)
//  */
// ReimbRouter.get('/fm/type/:type', fmGuard, async (req, resp) => {
//     const type = req.params.type;
//     try {
//         let payload = await reimbService.getReimbByType(type);
//         return resp.status(200).json(payload);
//     } catch (e) {
//         return resp.status(e.statusCode).json(e);
//     }
// });

/**
 * Resolve Reimbursements (Only visible to Finance managers)
 */
ReimbRouter.put('/fm', fmGuard, async (req, resp) => {

    console.log('PUT REQUEST RECEIVED AT /reimb');
    console.log(req.body);
    try {
        let newUser = await reimbService.resolveReimb(req.body);
        return resp.status(201).json(newUser).send();
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }

});

/**
 * Get specific Reimbursement ( visible for finance managers and employees)
 */
ReimbRouter.get('/:id', generalGuard, async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await reimbService.getReimbById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

/**
 * Get Reimbursements by AuthorID (Only visible to Employees)
 */
ReimbRouter.get('/employee/:id', userGuard, async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await reimbService.getReimbByAuthorId(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

/**
 * Add Reimbursements (Only visible to Employees)
 */
ReimbRouter.post('/employee', userGuard, async (req, resp) => {

    console.log('POST REQUEST RECEIVED AT /reimb');
    console.log(req.body);
    try {
        let newUser = await reimbService.addNewReimb(req.body);
        return resp.status(201).json(newUser);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

/**
 * Update Reimbursements (Only visible to Employees)
 */
ReimbRouter.put('/employee', userGuard, async (req, resp) => {

    console.log('PUT REQUEST RECEIVED AT /reimb/employee');
    console.log(req.body);
    try {
        let newUser = await reimbService.updateReimb(req.body);
        return resp.status(201).json(newUser).send();
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }

});



