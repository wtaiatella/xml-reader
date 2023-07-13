/*
  Warnings:

  - A unique constraint covering the columns `[Name]` on the table `Worldmaps` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Worldmaps_Name_key" ON "Worldmaps"("Name");
