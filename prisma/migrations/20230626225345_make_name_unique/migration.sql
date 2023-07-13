/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Worldmaps` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Worldmaps_name_key" ON "Worldmaps"("name");
