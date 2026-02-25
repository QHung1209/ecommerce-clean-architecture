/*
  Warnings:

  - Added the required column `slug` to the `CategoryTranslation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CategoryTranslation" ADD COLUMN     "slug" VARCHAR(500) NOT NULL;
