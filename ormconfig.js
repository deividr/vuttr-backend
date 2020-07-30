module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    process.env.NODE_ENV === 'development'
      ? './src/infra/database/typeorm/entities/*.ts'
      : './dist/infra/database/typeorm/entities/*.js',
  ],
  migrations: [
    process.env.NODE_ENV === 'development'
      ? './src/infra/database/typeorm/migrations/*.ts'
      : './dist/infra/database/typeorm/migrations/*.js',
  ],
  cli: {
    entitiesDir: './src/infra/database/typeorm/entities',
    migrationsDir: './src/infra/database/typeorm/migrations',
  },
}
