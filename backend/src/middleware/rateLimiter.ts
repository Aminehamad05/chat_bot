import rateLimit from 'express-rate-limit';
export const apiLimiter = rateLimit({
    windowMs: 15*60*1000,
    max:100,
    message: 'Too many requests, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
})
export const authLimiter = rateLimit({
    windowMs: 15*60*1000,
    max:10,
    message: 'Too many authentication requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
})