import { getBookings } from "@/actions/getBookings";
import { getHotelById } from "@/actions/getHotelById";
import HotelDetailsClient from "@/components/HotelDetailsClient";
import db from "@/lib/db";

interface HotelDetailsProps {
  params: { hotelId: string };
}

const HotelDetailsPage = async ({ params }: HotelDetailsProps) => {
  const hotel = await getHotelById(params.hotelId);

  if (!hotel) return <div>Oop? Hotel with the given id not found.</div>;

  const bookings = await getBookings(hotel.id);

  return (
    <div>
      <HotelDetailsClient hotel={hotel} bookings={bookings} />
    </div>
  );
};

export async function generateStaticParams() {
  const posts = await db.hotel.findMany({
    select: { id: true },
  });

  return posts.map((post) => ({
    hotelId: post.id,
  }));
}

export default HotelDetailsPage;
