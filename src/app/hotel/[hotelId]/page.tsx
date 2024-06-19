import { getHotelById } from "@/actions/getHotelById";
import AddHotelForm from "@/components/AddHotelForm";
import { auth } from "@clerk/nextjs/server";

interface HotelPageProp {
  params: {
    hotelId: string;
  };
}

const HotelPage = async ({ params }: HotelPageProp) => {
  const hotel = await getHotelById(params.hotelId);
  const { userId } = auth();

  if (!userId) return <div>Not authentication...</div>;

  if (hotel && hotel.userId !== userId) return <div>Access denied...</div>;

  return (
    <div>
      <AddHotelForm hotel={hotel} />
    </div>
  );
};

export default HotelPage;
