// scripts/create-admin.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {};
  args.forEach((arg) => {
    const [key, value] = arg.replace('--', '').split('=');
    result[key] = value;
  });
  return result;
}

async function createAdmin() {
  const args = parseArgs();

  const email    = args.email    || 'info@akbartaxstore.com';
  const name     = args.name     || 'Hussnain Akbar';
  const password = args.password || 'Akbar%1511.';
  const role     = args.role     || 'SUPER_ADMIN';

  // Validate
  if (!email.includes('@')) {
    console.error('❌ Invalid email address');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('❌ Password must be at least 8 characters');
    process.exit(1);
  }

  // Check if already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.error(`❌ User with email ${email} already exists`);
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role,
      status: 'ACTIVE',
    },
  });

  console.log('\n✅ Admin user created successfully!');
  console.log('────────────────────────────────────');
  console.log(`  ID:       ${user.id}`);
  console.log(`  Name:     ${user.name}`);
  console.log(`  Email:    ${user.email}`);
  console.log(`  Role:     ${user.role}`);
  console.log(`  Created:  ${user.createdAt.toISOString()}`);
  console.log('────────────────────────────────────');
  console.log('\nYou can now login at /admin/login\n');
}

createAdmin()
  .catch((e) => {
    console.error('❌ Error creating admin:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });