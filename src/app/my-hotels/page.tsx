import { getHotelsByUserId } from "@/actions/getHotelsByUserId";
import HotelCard from "@/components/HotelCard";

const MyHotels = async () => {
  const hotels = await getHotelsByUserId();

  if (!hotels)
    return (
      <div className="text-destructive text-center my-10">
        You do not have hotels or you are unauthorized
      </div>
    );

  return (
    <div>
      <h2 className="text-2xl font-semibold">Here are your properties</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-4">
        {hotels.map((hotel) => {
          return (
            <div key={hotel.id}>
              <HotelCard hotel={hotel} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyHotels;
