import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const hotel = await db.hotel.create({
      data: {
        ...body,
        userId,
      },
    });

    return NextResponse.json(hotel);
  } catch (error) {
    return new NextResponse("Interval Server Error", { status: 500 });
  }
}
