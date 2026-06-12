import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import dotenv from 'dotenv'
dotenv.config()

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! })

  const db = drizzle(pool)

  console.log('Running migrations...')

  await migrate(db, { migrationsFolder: './src/db/migrations' })

  console.log('\x1b[32m✓ Migrations complete\x1b[0m')
  
  await pool.end()
}

main().catch((err) => {
  console.log("DATABASE_URL =", process.env.DATABASE_URL)
  console.error('Migration failed:', err)
  process.exit(1)
})