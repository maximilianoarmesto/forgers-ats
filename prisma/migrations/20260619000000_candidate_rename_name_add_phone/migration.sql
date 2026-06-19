-- Rename `fullName` -> `name` (data-preserving) and add a nullable `phone` column.
ALTER TABLE "candidates" RENAME COLUMN "fullName" TO "name";

-- AlterTable
ALTER TABLE "candidates" ADD COLUMN "phone" TEXT;
