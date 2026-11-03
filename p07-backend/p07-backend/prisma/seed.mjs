import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed User Roles
  const roleAdmin = await prisma.userRole.upsert({
    where: { code: 'ADMIN' },
    update: {},
    create: { code: 'ADMIN', label: 'Administrator' },
  });

  const roleProfessor = await prisma.userRole.upsert({
    where: { code: 'PROFESSOR' },
    update: {},
    create: { code: 'PROFESSOR', label: 'Professor' },
  });

  const roleStudent = await prisma.userRole.upsert({
    where: { code: 'STUDENT' },
    update: {},
    create: { code: 'STUDENT', label: 'Student' },
  });

  // Seed Call Statuses
  const callStatusOpen = await prisma.callStatus.upsert({
    where: { code: 'OPEN' },
    update: {},
    create: { code: 'OPEN', label: 'Open' },
  });

  const callStatusClosed = await prisma.callStatus.upsert({
    where: { code: 'CLOSED' },
    update: {},
    create: { code: 'CLOSED', label: 'Closed' },
  });

  // Seed Attendance Statuses
  const attendancePresent = await prisma.attendanceStatus.upsert({
    where: { code: 'PRESENT' },
    update: {},
    create: { code: 'PRESENT', label: 'Present' },
  });

  const attendanceAbsent = await prisma.attendanceStatus.upsert({
    where: { code: 'ABSENT' },
    update: {},
    create: { code: 'ABSENT', label: 'Absent' },
  });

  const attendanceJustified = await prisma.attendanceStatus.upsert({
    where: { code: 'JUSTIFIED' },
    update: {},
    create: { code: 'JUSTIFIED', label: 'Justified Absence' },
  });

  console.log('✅ Seed completed successfully');
  console.log({
    roles: { roleAdmin, roleProfessor, roleStudent },
    callStatuses: { callStatusOpen, callStatusClosed },
    attendanceStatuses: { attendancePresent, attendanceAbsent, attendanceJustified },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
