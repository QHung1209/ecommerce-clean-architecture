/*
  Warnings:

  - Made the column `createdById` on table `Media` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_createdById_fkey";

-- AlterTable
ALTER TABLE "Media" ALTER COLUMN "createdById" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
