"use server";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";

export const getHotelsByUserId = async () => {
  try {
    const { userId } = auth();

    if (!userId) {
      redirect("/");
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
    if (isRedirectError(error)) return;
    throw new Error(error);
  }
};
