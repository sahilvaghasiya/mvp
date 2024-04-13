export const database = {
  type: 'mysql' as const,
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'mvp-ecommerce',
  entities: ['dist/**/*.entity.js'],
};

export const jwtSecret = 'newJwtTokenForAllTheTime';
