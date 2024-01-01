const env = process.env;

export const environment = {
  PORT: env.PORT || 3000,
  ENV: env.ENV || 'development',
  DATABASE_URL: env.DATABASE_URL || 'postgresql://postgres:password@localhost:54321/postgres',
  ACCESS_TOKEN_SECRET: env.ACCESS_TOKEN_SECRET || '1e6f7379c0fa5e6a810c2fcd3a537dd82e188241fa867b45',
  REFRESH_TOKEN_SECRET: env.REFRESH_TOKEN_SECRET || '0a139ce9ec3515bcd64df16e63c620a891deed47d694388f',
}
