"use server";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export const getHotelsByUserId = async () => {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const hotel = await db.hotel.findMany({
      where: { userId },
      include: {
        rooms: true,
      },
    });

    if (!hotel) return null;

    return hotel;
  } catch (error: any) {
    throw new Error(error);
  }
};
