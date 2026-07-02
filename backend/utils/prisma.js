import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const dbUrlStr = process.env.DATABASE_URL;
if (!dbUrlStr) {
  throw new Error('DATABASE_URL environment variable is not defined.');
}

const dbUrl = new URL(dbUrlStr);

const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: dbUrl.port ? parseInt(dbUrl.port) : 3306,
  user: decodeURIComponent(dbUrl.username),
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.replace(/^\//, ''),
});

const prisma = new PrismaClient({ adapter });

export default prisma;
