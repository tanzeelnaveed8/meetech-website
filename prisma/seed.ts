import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create admin user
  const adminPasswordHash = await bcrypt.hash('admin123', 12)

  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@meetech.com' },
  })

  let admin
  if (existingAdmin) {
    console.log('Admin user already exists:', existingAdmin.email)
    admin = existingAdmin
  } else {
    admin = await prisma.user.create({
      data: {
        email: 'admin@meetech.com',
        passwordHash: adminPasswordHash,
        name: 'Admin User',
        role: 'ADMIN',
        isActive: true,
      },
    })
    console.log('✅ Created admin user:', admin.email)
  }

  // Create project managers
  const managerPasswordHash = await bcrypt.hash('manager123', 12)

  const existingFurqan = await prisma.user.findUnique({
    where: { email: 'furqan@meetech.com' },
  })

  let furqan
  if (existingFurqan) {
    console.log('Manager Furqan already exists:', existingFurqan.email)
    furqan = existingFurqan
  } else {
    furqan = await prisma.user.create({
      data: {
        email: 'furqan@meetech.com',
        passwordHash: managerPasswordHash,
        name: 'Furqan',
        role: 'EDITOR',
        isActive: true,
      },
    })
    console.log('✅ Created manager:', furqan.email)
  }

  const existingFaran = await prisma.user.findUnique({
    where: { email: 'faran@meetech.com' },
  })

  let faran
  if (existingFaran) {
    console.log('Manager Faran already exists:', existingFaran.email)
    faran = existingFaran
  } else {
    faran = await prisma.user.create({
      data: {
        email: 'faran@meetech.com',
        passwordHash: managerPasswordHash,
        name: 'Faran',
        role: 'EDITOR',
        isActive: true,
      },
    })
    console.log('✅ Created manager:', faran.email)
  }

  // Create sample client users
  const clientPasswordHash = await bcrypt.hash('client123', 12)

  const existingClient1 = await prisma.user.findUnique({
    where: { email: 'john@example.com' },
  })

  let client1
  if (existingClient1) {
    console.log('Client 1 already exists:', existingClient1.email)
    client1 = existingClient1
  } else {
    client1 = await prisma.user.create({
      data: {
        email: 'john@example.com',
        passwordHash: clientPasswordHash,
        name: 'John Doe',
        role: 'CLIENT',
        isActive: true,
      },
    })
    console.log('✅ Created client user:', client1.email)
  }

  const existingClient2 = await prisma.user.findUnique({
    where: { email: 'jane@example.com' },
  })

  let client2
  if (existingClient2) {
    console.log('Client 2 already exists:', existingClient2.email)
    client2 = existingClient2
  } else {
    client2 = await prisma.user.create({
      data: {
        email: 'jane@example.com',
        passwordHash: clientPasswordHash,
        name: 'Jane Smith',
        role: 'CLIENT',
        isActive: true,
      },
    })
    console.log('✅ Created client user:', client2.email)
  }

  // Create sample projects
  const existingProject1 = await prisma.project.findFirst({
    where: { name: 'E-commerce Website Redesign' },
  })

  if (!existingProject1) {
    const project1 = await prisma.project.create({
      data: {
        name: 'E-commerce Website Redesign',
        description: 'Complete redesign of the e-commerce platform with modern UI/UX',
        scope: 'Full website redesign including homepage, product pages, checkout flow, and admin dashboard',
        status: 'IN_PROGRESS',
        progress: 65,
        clientId: client1.id,
        managerId: admin.id,
        startDate: new Date('2024-01-15'),
        expectedEndDate: new Date('2024-06-30'),
        milestones: {
          create: [
            {
              title: 'Design Phase',
              description: 'Create wireframes and mockups for all pages',
              status: 'COMPLETED',
              order: 1,
              expectedDate: new Date('2024-02-15'),
              completedDate: new Date('2024-02-10'),
            },
            {
              title: 'Frontend Development',
              description: 'Implement responsive UI components',
              status: 'IN_PROGRESS',
              order: 2,
              expectedDate: new Date('2024-04-30'),
            },
            {
              title: 'Backend Integration',
              description: 'Connect frontend with existing APIs',
              status: 'PENDING',
              order: 3,
              expectedDate: new Date('2024-05-31'),
            },
            {
              title: 'Testing & Launch',
              description: 'QA testing and production deployment',
              status: 'PENDING',
              order: 4,
              expectedDate: new Date('2024-06-30'),
            },
          ],
        },
        payments: {
          create: [
            {
              amount: 5000,
              currency: 'USD',
              description: 'Initial deposit (50%)',
              status: 'PAID',
              dueDate: new Date('2024-01-15'),
              paidDate: new Date('2024-01-15'),
            },
            {
              amount: 5000,
              currency: 'USD',
              description: 'Final payment (50%)',
              status: 'PENDING',
              dueDate: new Date('2024-06-30'),
            },
          ],
        },
        changeRequests: {
          create: [
            {
              title: 'Add Product Comparison Feature',
              message: 'We would like to add a feature that allows users to compare multiple products side by side.',
              status: 'APPROVED',
              clientId: client1.id,
              adminResponse: 'Great idea! We can implement this in the next sprint. Estimated 2 weeks.',
              reviewedAt: new Date('2024-03-05'),
            },
          ],
        },
      },
    })
    console.log('✅ Created project:', project1.name)
  }

  const existingProject2 = await prisma.project.findFirst({
    where: { name: 'Mobile App Development' },
  })

  if (!existingProject2) {
    const project2 = await prisma.project.create({
      data: {
        name: 'Mobile App Development',
        description: 'Native iOS and Android app for customer engagement',
        scope: 'Cross-platform mobile application with push notifications, user authentication, and real-time updates',
        status: 'PLANNING',
        progress: 15,
        clientId: client2.id,
        managerId: admin.id,
        startDate: new Date('2024-03-01'),
        expectedEndDate: new Date('2024-09-30'),
        milestones: {
          create: [
            {
              title: 'Requirements Gathering',
              description: 'Document all features and technical requirements',
              status: 'COMPLETED',
              order: 1,
              expectedDate: new Date('2024-03-15'),
              completedDate: new Date('2024-03-12'),
            },
            {
              title: 'UI/UX Design',
              description: 'Create app designs and user flows',
              status: 'IN_PROGRESS',
              order: 2,
              expectedDate: new Date('2024-04-15'),
            },
          ],
        },
        payments: {
          create: [
            {
              amount: 15000,
              currency: 'USD',
              description: 'Project kickoff payment (30%)',
              status: 'PAID',
              dueDate: new Date('2024-03-01'),
              paidDate: new Date('2024-03-01'),
            },
            {
              amount: 17500,
              currency: 'USD',
              description: 'Development milestone (35%)',
              status: 'PENDING',
              dueDate: new Date('2024-06-30'),
            },
            {
              amount: 17500,
              currency: 'USD',
              description: 'Final delivery (35%)',
              status: 'PENDING',
              dueDate: new Date('2024-09-30'),
            },
          ],
        },
        changeRequests: {
          create: [
            {
              title: 'Add Dark Mode Support',
              message: 'Can we include dark mode as part of the initial release?',
              status: 'IN_REVIEW',
              clientId: client2.id,
            },
          ],
        },
      },
    })
    console.log('✅ Created project:', project2.name)
  }

  const existingProject3 = await prisma.project.findFirst({
    where: { name: 'SEO Optimization Campaign' },
  })

  if (!existingProject3) {
    const project3 = await prisma.project.create({
      data: {
        name: 'SEO Optimization Campaign',
        description: 'Comprehensive SEO strategy and implementation',
        scope: 'Technical SEO audit, content optimization, link building, and monthly reporting',
        status: 'COMPLETED',
        progress: 100,
        clientId: client1.id,
        managerId: admin.id,
        startDate: new Date('2023-10-01'),
        expectedEndDate: new Date('2024-01-31'),
        actualEndDate: new Date('2024-01-28'),
        milestones: {
          create: [
            {
              title: 'SEO Audit',
              description: 'Complete technical and content audit',
              status: 'COMPLETED',
              order: 1,
              expectedDate: new Date('2023-10-15'),
              completedDate: new Date('2023-10-14'),
            },
            {
              title: 'On-Page Optimization',
              description: 'Optimize meta tags, content, and site structure',
              status: 'COMPLETED',
              order: 2,
              expectedDate: new Date('2023-11-30'),
              completedDate: new Date('2023-11-28'),
            },
            {
              title: 'Link Building',
              description: 'Build high-quality backlinks',
              status: 'COMPLETED',
              order: 3,
              expectedDate: new Date('2024-01-31'),
              completedDate: new Date('2024-01-28'),
            },
          ],
        },
        payments: {
          create: [
            {
              amount: 3000,
              currency: 'USD',
              description: 'Full project payment',
              status: 'PAID',
              dueDate: new Date('2023-10-01'),
              paidDate: new Date('2023-10-01'),
            },
          ],
        },
      },
    })
    console.log('✅ Created project:', project3.name)
  }

  console.log('\n📧 Login Credentials:')
  console.log('Admin - Email: admin@meetech.com | Password: admin123')
  console.log('Manager - Email: furqan@meetech.com | Password: manager123')
  console.log('Manager - Email: faran@meetech.com | Password: manager123')
  console.log('Client 1 - Email: john@example.com | Password: client123')
  console.log('Client 2 - Email: jane@example.com | Password: client123')
  console.log('\n⚠️  Please change these passwords in production!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
