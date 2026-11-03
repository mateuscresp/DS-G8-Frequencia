import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.class.findMany({
      include: {
        teachers: {
          include: {
            teacher: {
              include: {
                user: true,
              },
            },
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
            teacher: {
              include: {
                user: true,
              },
            },
          },
        },
        enrollments: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }

  async findStudentsInClass(classId: string) {
    return this.prisma.enrollment.findMany({
      where: { classId },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    });
  }
}
