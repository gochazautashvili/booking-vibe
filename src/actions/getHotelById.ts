"use server";
import db from "@/lib/db";

export const getHotelById = async (hotelId: string) => {
  try {
    const hotel = await db.hotel.findUnique({
      where: { id: hotelId },
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
