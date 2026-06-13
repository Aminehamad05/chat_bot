declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string
    DATABASE_URL: string
    JWT_SECRET: string
    JWT_EXPIRES_IN: string
    GEMINI_API_KEY: string
    CLIENT_URL: string
    NODE_ENV: 'development' | 'production' | 'test'
  }
}
