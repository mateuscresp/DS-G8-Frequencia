/*
  Warnings:

  - You are about to drop the column `registeredAt` on the `attendances` table. All the data in the column will be lost.
  - The primary key for the `students` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `students` table. All the data in the column will be lost.
  - The primary key for the `teachers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `teachers` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `teachers` table. All the data in the column will be lost.
  - You are about to drop the `user_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `keycloakId` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `keycloakId` to the `teachers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "attendances" DROP CONSTRAINT "attendances_studentId_fkey";

-- DropForeignKey
ALTER TABLE "class_teachers" DROP CONSTRAINT "class_teachers_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_studentId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_userId_fkey";

-- DropForeignKey
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_userId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_roleId_fkey";

-- DropIndex
DROP INDEX "students_userId_idx";

-- DropIndex
DROP INDEX "students_userId_key";

-- DropIndex
DROP INDEX "teachers_userId_idx";

-- DropIndex
DROP INDEX "teachers_userId_key";

-- AlterTable
ALTER TABLE "attendances" DROP COLUMN "registeredAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "studentId" SET DATA TYPE TEXT,
ALTER COLUMN "markedBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "audit_logs" ALTER COLUMN "entityId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "calls" ALTER COLUMN "openedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "class_teachers" ALTER COLUMN "teacherId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "enrollments" ALTER COLUMN "studentId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "students" DROP CONSTRAINT "students_pkey",
DROP COLUMN "id",
DROP COLUMN "userId",
ADD COLUMN     "keycloakId" TEXT NOT NULL,
ADD CONSTRAINT "students_pkey" PRIMARY KEY ("keycloakId");

-- AlterTable
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_pkey",
DROP COLUMN "id",
DROP COLUMN "userId",
ADD COLUMN     "keycloakId" TEXT NOT NULL,
ADD CONSTRAINT "teachers_pkey" PRIMARY KEY ("keycloakId");

-- DropTable
DROP TABLE "user_roles";

-- DropTable
DROP TABLE "users";

-- AddForeignKey
ALTER TABLE "class_teachers" ADD CONSTRAINT "class_teachers_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("keycloakId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("keycloakId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("keycloakId") ON DELETE CASCADE ON UPDATE CASCADE;
