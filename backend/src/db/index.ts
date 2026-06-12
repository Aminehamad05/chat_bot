import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { env } from '../config/env'
import * as schema from './schema'

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,               // max connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('\x1b[31m✗ Database connection failed:\x1b[0m', err.message)
    process.exit(1)
  }
  release()
  console.log('\x1b[32m✓ Database connected\x1b[0m')
})

export const db = drizzle(pool, { schema })
export type DB = typeof db