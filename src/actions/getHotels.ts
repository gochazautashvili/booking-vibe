"use server";
import db from "@/lib/db";

export const getHotels = async (searchParams: {
  title: string;
  country: string;
  state: string;
  city: string;
}) => {
  try {
    const { title, city, country, state } = searchParams;

    const hotels = await db.hotel.findMany({
      where: {
        title: { contains: title },
        country,
        state,
        city,
      },
      include: { rooms: true },
    });

    return hotels;
  } catch (error: any) {
    throw new Error(error);
  }
};
