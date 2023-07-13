/*
  Warnings:

  - You are about to drop the column `name` on the `Worldmaps` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Name]` on the table `Worldmaps` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Name` to the `Worldmaps` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Worldmaps_name_key";

-- AlterTable
ALTER TABLE "Worldmaps" DROP COLUMN "name",
ADD COLUMN     "Name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Worldmaps_Name_key" ON "Worldmaps"("Name");
