"use server";

import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";

export const getBookingByHotelOwnerId = async () => {
  try {
    const { userId } = auth();

    if (!userId) {
      redirect("/");
    }

    const bookings = await db.booking.findMany({
      where: {
        hotelOwnerId: userId,
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
    if (isRedirectError(error)) return;
    throw new Error(error);
  }
};
