-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_createdById_fkey";

-- AlterTable
ALTER TABLE "Media" ALTER COLUMN "createdById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
