/*
  Warnings:

  - You are about to drop the column `languageId` on the `BrandTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `languageId` on the `CategoryTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `languageId` on the `ProductTranslation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `CategoryTranslation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `languageCode` to the `BrandTranslation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `languageCode` to the `CategoryTranslation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `languageCode` to the `ProductTranslation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BrandTranslation" DROP CONSTRAINT "BrandTranslation_languageId_fkey";

-- DropForeignKey
ALTER TABLE "CategoryTranslation" DROP CONSTRAINT "CategoryTranslation_languageId_fkey";

-- DropForeignKey
ALTER TABLE "ProductTranslation" DROP CONSTRAINT "ProductTranslation_languageId_fkey";

-- AlterTable
ALTER TABLE "BrandTranslation" DROP COLUMN "languageId",
ADD COLUMN     "languageCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CategoryTranslation" DROP COLUMN "languageId",
ADD COLUMN     "languageCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductTranslation" DROP COLUMN "languageId",
ADD COLUMN     "languageCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CategoryTranslation_slug_key" ON "CategoryTranslation"("slug");

-- AddForeignKey
ALTER TABLE "ProductTranslation" ADD CONSTRAINT "ProductTranslation_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "Language"("code") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CategoryTranslation" ADD CONSTRAINT "CategoryTranslation_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "Language"("code") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "BrandTranslation" ADD CONSTRAINT "BrandTranslation_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "Language"("code") ON DELETE CASCADE ON UPDATE NO ACTION;
