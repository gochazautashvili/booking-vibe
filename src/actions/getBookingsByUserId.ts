"use server";

import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export const getBookingByUserId = async () => {
  try {
    const { userId } = auth();

    if (!userId) throw new Error("Unauthorized");

    const bookings = await db.booking.findMany({
      where: {
        userId,
      },
      include: {
        Room: true,
        Hotel: true,
      },
      orderBy: {
        bookedAt: "desc",
      },
    });

    if (!bookings) return null;

    return bookings;
  } catch (error: any) {
    throw new Error(error);
  }
};