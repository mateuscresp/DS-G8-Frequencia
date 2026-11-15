import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

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

  const attendanceManual = await prisma.attendanceStatus.upsert({
    where: { code: 'MANUAL' },
    update: {},
    create: { code: 'MANUAL', label: 'Manual Correction' },
  });

  console.log('✅ Seed completed successfully');
  console.log({
    callStatuses: { callStatusOpen, callStatusClosed },
    attendanceStatuses: { attendancePresent, attendanceAbsent, attendanceManual },
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
