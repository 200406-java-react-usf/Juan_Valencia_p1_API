import { Request, Response } from "express";
import { AuthenticationError, AuthorizationError } from "../errors/errors";

export const adminGuard = (req: Request, resp: Response, next) => {

    if (!req.session.principal) {
        resp.status(401).json(new AuthenticationError('No session found! Please login.'));
    } else if (req.session.principal.role === 'admin') {
        next();
    } else {
        resp.status(403).json(new AuthorizationError());
    }

}

export const fmGuard = (req: Request, resp: Response, next) => {

    if (!req.session.principal) {
        resp.status(401).json(new AuthenticationError('No session found! Please login.'));
    } else if (req.session.principal.role === 'finance manager') {
        next();
    } else {
        resp.status(403).json(new AuthorizationError());
    }

}

export const userGuard = (req: Request, resp: Response, next) => {

    if (!req.session.principal) {
        resp.status(401).json(new AuthenticationError('No session found! Please login.'));
    } else if (req.session.principal.role === 'user') {
        next();
    } else {
        resp.status(403).json(new AuthorizationError());
    }

}

export const generalGuard = (req: Request, resp: Response, next) => {

    if (!req.session.principal) {
        resp.status(401).json(new AuthenticationError('No session found! Please login.'));
    } else if (req.session.principal.role === 'user' || req.session.principal.role === 'finance manager') {
        next();
    } else {
        resp.status(403).json(new AuthorizationError());
    }

}