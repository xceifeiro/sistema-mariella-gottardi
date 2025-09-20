import postgres from 'postgres'

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: process.env.DATABASE_USE_SSL === 'true',
})

export default sql