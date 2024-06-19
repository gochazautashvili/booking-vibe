import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { hotelId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = auth();

    if (!params.hotelId) {
      return new NextResponse("Hotel id is required", { status: 401 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const hotel = await db.hotel.update({
      where: { id: params.hotelId },
      data: {
        ...body,
      },
    });

    return NextResponse.json(hotel);
  } catch (error) {
    return new NextResponse("Interval Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { hotelId: string } }
) {
  try {
    const { userId } = auth();

    if (!params.hotelId) {
      return new NextResponse("Hotel id is required", { status: 401 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.hotel.delete({
      where: { id: params.hotelId },
    });

    return new NextResponse("Successfully deleted");
  } catch (error) {
    return new NextResponse("Interval Server Error", { status: 500 });
  }
}
