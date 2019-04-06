import * as express from 'express';

export interface IUserRequest extends express.Request {
    logout(): void;
    user: any
}

export interface ISignUpRequest extends express.Request {
    body: {
        email: string;
        password: string;
        login: string;
        firstName: string;
        lastName: string;
    }
}
