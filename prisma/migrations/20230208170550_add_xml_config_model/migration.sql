-- CreateTable
CREATE TABLE "XmlConfig" (
    "key" TEXT NOT NULL,
    "oldSizeX" DOUBLE PRECISION NOT NULL,
    "oldSizeY" DOUBLE PRECISION NOT NULL,
    "newSizeX" DOUBLE PRECISION,
    "newSizeY" DOUBLE PRECISION,
    "limitLeft" DOUBLE PRECISION,
    "limitRight" DOUBLE PRECISION,
    "hasRightMenu" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "XmlConfig_pkey" PRIMARY KEY ("key")
);
