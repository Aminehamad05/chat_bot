import {Request , Response, NextFunction} from 'express';
export function requestLogger(req:Request,res:Response,next:NextFunction){
    const start = Date.now();
    res.on('finish', () => {
    const duration = Date.now() - start
    const color = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m'
    const reset = '\x1b[0m'
    console.log(
      `${color}${req.method}${reset} ${req.url} → ${res.statusCode} (${duration}ms)`
    )
  })
  next();
}