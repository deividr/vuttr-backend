module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    process.env.NODE_ENV === 'production'
      ? './dist/infra/database/typeorm/entities/*.js'
      : './src/infra/database/typeorm/entities/*.ts',
  ],
  migrations: [
    process.env.NODE_ENV === 'production'
      ? './dist/infra/database/typeorm/migrations/*.js'
      : './src/infra/database/typeorm/migrations/*.ts',
  ],
  cli: {
    entitiesDir: './src/infra/database/typeorm/entities',
    migrationsDir: './src/infra/database/typeorm/migrations',
  },
}
