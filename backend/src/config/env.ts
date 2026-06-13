import dotenv from 'dotenv';
dotenv.config();
const required = [
    'DATABASE_URL',
    'JWT_SECRET',
    'GEMINI_API_KEY',
] as const;
for (const key of required){
    if(!process.env[key]){
        throw new Error(`Missing required environment variable: ${key}`);
    }
}
export const env = {
    PORT: process.env.PORT || 3000,
    DATABASE_URL: process.env.DATABASE_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY!,
    clientUrl:process.env.CLIENT_URL ?? 'http://localhost:5173',
    NODE_ENV: process.env.NODE_ENV ?? 'development',
} as const;