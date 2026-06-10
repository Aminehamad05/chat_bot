import { isSingleStoreSchema } from 'drizzle-orm/singlestore-core';
import {Request, Response, NextFunction} from 'express';
export class AppError extends Error{
    constructor(public message: string, public statusCode: number = 500){
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}
export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({error : err.message})
    }
    console.log("[UNhandled error]",err);
    return res.status(500).json({error : "Internal Server Error"});
}