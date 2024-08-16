import { getHotels } from "@/actions/getHotels";
import HotelCard from "./HotelCard";
import { HomeProps } from "@/app/page";

const HotelList = async ({ searchParams }: HomeProps) => {
  const hotels = await getHotels(searchParams);

  if (!hotels) return <div>No hotels found....</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-4">
      {hotels.map((hotel) => {
        return (
          <div key={hotel.id}>
            <HotelCard hotel={hotel} />
          </div>
        );
      })}
    </div>
  );
};

export default HotelList;
