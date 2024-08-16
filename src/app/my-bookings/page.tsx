import { getBookingByHotelOwnerId } from "@/actions/getBookingsByOwnerId";
import { getBookingByUserId } from "@/actions/getBookingsByUserId";
import MyBookingClient from "@/components/MyBookingClient";

const MyBookings = async () => {
  const bookingsFromVisitors = await getBookingByHotelOwnerId();
  const bookingsHaveMade = await getBookingByUserId();

  if (!bookingsFromVisitors && !bookingsHaveMade)
    return (
      <div className="text-center my-10 text-destructive">
        No bookings found
      </div>
    );

  return (
    <div className="flex flex-col gap-10">
      {!!bookingsHaveMade?.length && (
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-6 mt-2">
            Here are booking you have made
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookingsHaveMade.map((booking) => {
              return <MyBookingClient key={booking.id} booking={booking} />;
            })}
          </div>
        </div>
      )}
      {!!bookingsFromVisitors?.length && (
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-6 mt-2">
            Here are booking visitors have made on your properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookingsFromVisitors.map((booking) => {
              return <MyBookingClient key={booking.id} booking={booking} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
