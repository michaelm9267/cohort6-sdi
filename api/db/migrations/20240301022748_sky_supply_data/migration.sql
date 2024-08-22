-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "shopID" INTEGER NOT NULL,
    "hashedPassword" TEXT NOT NULL DEFAULT '',
    "salt" TEXT NOT NULL DEFAULT '',
    "resetToken" TEXT,
    "roles" TEXT,
    "resetTokenExpiresAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'users',
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shop" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "dodaac" TEXT NOT NULL DEFAULT 'FB4661',
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" INTEGER NOT NULL,
    "orgCode" TEXT NOT NULL,
    "shopCode" INTEGER NOT NULL,
    "owner" TEXT NOT NULL,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "orderNumber" SERIAL NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderStatus" TEXT DEFAULT 'draft',
    "shopID" INTEGER,
    "userID" INTEGER,
    "partId" INTEGER,
    "orderQuantity" INTEGER NOT NULL,
    "dueInDoc" TEXT,
    "dueOutDoc" TEXT,
    "rdd" TEXT,
    "ujc" TEXT,
    "dodaac" TEXT,
    "texCode" TEXT,
    "jcn" TEXT,
    "shipTo" TEXT,
    "sd" TEXT,
    "projectCode" TEXT,
    "demandCode" TEXT,
    "wuc" TEXT,
    "toRef" TEXT,
    "markFor" TEXT,
    "priority" INTEGER,
    "conFad" TEXT,
    "message" TEXT,
    "addedToInventory" BOOLEAN DEFAULT false,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Part" (
    "id" SERIAL NOT NULL,
    "nomenclature" TEXT NOT NULL,
    "nsn" TEXT NOT NULL,
    "partNumber" TEXT,
    "cageCode" TEXT,
    "unitOfIssue" TEXT,
    "unitPrice" TEXT,
    "isg" TEXT,
    "commodityCode" TEXT,
    "shelfLifeCode" TEXT,
    "typeCargoCode" TEXT,
    "hazardousMaterialCode" TEXT,
    "rid" TEXT,
    "location" TEXT,
    "nmfc" TEXT,
    "description" TEXT,
    "manufacturer" TEXT,
    "status" TEXT DEFAULT 'parts',
    "submittingShop" INTEGER,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "orderID" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRequest" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "shopID" INTEGER NOT NULL,

    CONSTRAINT "UserRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shopinventory" (
    "id" SERIAL NOT NULL,
    "partId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "maxQuantity" INTEGER NOT NULL DEFAULT 100,
    "shopID" INTEGER,

    CONSTRAINT "Shopinventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_shopCode_key" ON "Shop"("shopCode");

-- CreateIndex
CREATE UNIQUE INDEX "Part_nsn_key" ON "Part"("nsn");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_shopID_fkey" FOREIGN KEY ("shopID") REFERENCES "Shop"("shopCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shopID_fkey" FOREIGN KEY ("shopID") REFERENCES "Shop"("shopCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_orderID_fkey" FOREIGN KEY ("orderID") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shopinventory" ADD CONSTRAINT "Shopinventory_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shopinventory" ADD CONSTRAINT "Shopinventory_shopID_fkey" FOREIGN KEY ("shopID") REFERENCES "Shop"("shopCode") ON DELETE SET NULL ON UPDATE CASCADE;
