/*
  Warnings:

  - A unique constraint covering the columns `[languageCode,slug]` on the table `CategoryTranslation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CategoryTranslation_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "CategoryTranslation_languageCode_slug_key" ON "CategoryTranslation"("languageCode", "slug");
