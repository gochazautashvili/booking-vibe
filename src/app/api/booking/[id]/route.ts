import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();

    if (!params.id) {
      return new NextResponse("Payment intent id is required", { status: 401 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const booking = await db.booking.update({
      where: { paymentIntentId: params.id },
      data: {
        paymentStatus: true,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    return new NextResponse("Interval Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();

    if (!params.id) {
      return new NextResponse("Hotel id is required", { status: 401 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const bookings = await db.booking.findMany({
      where: {
        paymentStatus: true,
        roomId: params.id,
        endDate: {
          gt: yesterday,
        },
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    return new NextResponse("Interval Server Error", { status: 500 });
  }
}
