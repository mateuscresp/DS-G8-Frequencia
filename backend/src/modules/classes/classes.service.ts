import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.class.findMany({
      include: {
        teachers: {
          include: {
            teacher: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.class.findUnique({
      where: { id },
      include: {
        teachers: {
          include: {
            teacher: true,
          },
        },
        enrollments: {
          include: {
            student: true,
          },
        },
      },
    });
  }

  async findStudentsInClass(classId: string) {
    return this.prisma.enrollment.findMany({
      where: { classId },
      include: {
        student: true,
      },
    });
  }
}
