import 'dotenv/config';
import prisma from '../utils/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  console.log('Seeding database...');

  // Hash passwords
  const adminHashed = await bcrypt.hash('admin123', 10);
  const customerHashed = await bcrypt.hash('customer123', 10);

  // Seed Admin idempotently
  const admin = await prisma.user.upsert({
    where: { email: 'admin@moonhaul.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@moonhaul.com',
      password: adminHashed,
      role: 'ADMIN',
    },
  });
  console.log('Admin seeded successfully:', admin.email);

  // Seed Customer idempotently
  const customer = await prisma.user.upsert({
    where: { email: 'customer@moonhaul.com' },
    update: {},
    create: {
      name: 'John Customer',
      email: 'customer@moonhaul.com',
      password: customerHashed,
      role: 'CUSTOMER',
    },
  });
  console.log('Customer seeded successfully:', customer.email);

  console.log('Database seeding finished.');
}

main()
  .catch((e) => {
    console.error('Error during database seed execution:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
