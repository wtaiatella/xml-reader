-- CreateTable
CREATE TABLE "Worldmaps" (
    "key" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "Width" INTEGER NOT NULL,
    "Height" INTEGER NOT NULL,
    "newSizeX" INTEGER,
    "newSizeY" INTEGER,
    "limitLeft" INTEGER,
    "limitRight" INTEGER,
    "hasRightMenu" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Worldmaps_pkey" PRIMARY KEY ("key")
);
