-- CreateTable
CREATE TABLE "Hotel" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "locationDescription" TEXT NOT NULL,
    "gym" BOOLEAN NOT NULL DEFAULT false,
    "spa" BOOLEAN NOT NULL DEFAULT false,
    "bar" BOOLEAN NOT NULL DEFAULT false,
    "laundry" BOOLEAN NOT NULL DEFAULT false,
    "shopping" BOOLEAN NOT NULL DEFAULT false,
    "freeWifi" BOOLEAN NOT NULL DEFAULT false,
    "movieNights" BOOLEAN NOT NULL DEFAULT false,
    "swimmingpool" BOOLEAN NOT NULL DEFAULT false,
    "coffeeShop" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bedCount" INTEGER NOT NULL DEFAULT 0,
    "guestCount" INTEGER NOT NULL DEFAULT 0,
    "bathroomCount" INTEGER NOT NULL DEFAULT 0,
    "kingBed" INTEGER NOT NULL DEFAULT 0,
    "quennBed" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT NOT NULL,
    "breakFastPrice" INTEGER NOT NULL,
    "roomPrice" INTEGER NOT NULL,
    "roomeService" BOOLEAN NOT NULL DEFAULT false,
    "TV" BOOLEAN NOT NULL DEFAULT false,
    "balcony" BOOLEAN NOT NULL DEFAULT false,
    "freeWifi" BOOLEAN NOT NULL DEFAULT false,
    "cityView" BOOLEAN NOT NULL DEFAULT false,
    "oceanView" BOOLEAN NOT NULL DEFAULT false,
    "forestView" BOOLEAN NOT NULL DEFAULT false,
    "mountineView" BOOLEAN NOT NULL DEFAULT false,
    "airCondition" BOOLEAN NOT NULL DEFAULT false,
    "soundProofed" BOOLEAN NOT NULL DEFAULT false,
    "hotelId" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hotelOwnerId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "breakFastIncluded" BOOLEAN NOT NULL,
    "currency" TEXT NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "paymentStatus" BOOLEAN NOT NULL DEFAULT false,
    "paymentIntentId" TEXT NOT NULL,
    "bookedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hotelId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Room_hotelId_idx" ON "Room"("hotelId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_paymentIntentId_key" ON "Booking"("paymentIntentId");

-- CreateIndex
CREATE INDEX "Booking_hotelId_roomId_idx" ON "Booking"("hotelId", "roomId");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
