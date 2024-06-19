import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = auth();

    if (!params.roomId) {
      return new NextResponse("Room id is required", { status: 401 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const room = await db.room.update({
      where: { id: params.roomId },
      data: {
        ...body,
      },
    });

    return NextResponse.json(room);
  } catch (error) {
    return new NextResponse("Interval Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const { userId } = auth();

    if (!params.roomId) {
      return new NextResponse("Hotel id is required", { status: 401 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.room.delete({
      where: { id: params.roomId },
    });

    return new NextResponse("Successfully deleted");
  } catch (error) {
    return new NextResponse("Interval Server Error", { status: 500 });
  }
}
