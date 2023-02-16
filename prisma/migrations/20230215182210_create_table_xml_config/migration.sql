-- CreateTable
CREATE TABLE "XmlConfig" (
    "key" TEXT NOT NULL,
    "Width" INTEGER NOT NULL,
    "Height" INTEGER NOT NULL,
    "newSizeX" INTEGER,
    "newSizeY" INTEGER,
    "limitLeft" INTEGER,
    "limitRight" INTEGER,
    "hasRightMenu" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "XmlConfig_pkey" PRIMARY KEY ("key")
);
