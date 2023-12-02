const env = process.env;

export const environment = {
  PORT: env.PORT || 3000,
  DATABASE_URL: env.DATABASE_URL || 'postgresql://postgres:password@localhost:54321/postgres'
}
