import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 12)

  // Check if admin already exists
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: 'admin@meetech.com' },
  })

  if (existingAdmin) {
    console.log('Admin user already exists:', existingAdmin.email)
    return
  }

  const admin = await prisma.adminUser.create({
    data: {
      email: 'admin@meetech.com',
      passwordHash,
      name: 'Admin User',
      role: 'ADMIN',
      isActive: true,
    },
  })

  console.log('✅ Created admin user:', admin.email)
  console.log('📧 Email: admin@meetech.com')
  console.log('🔑 Password: admin123')
  console.log('⚠️  Please change this password in production!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
