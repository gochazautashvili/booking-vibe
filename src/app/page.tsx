import { getHotels } from "@/actions/getHotels";
import HotelList from "@/components/HotelList";

interface HomeProps {
  searchParams: {
    title: string;
    country: string;
    state: string;
    city: string;
  };
}

const HomePage = async ({ searchParams }: HomeProps) => {
  const hotels = await getHotels(searchParams);

  if (!hotels) return <div>No hotels found....</div>;

  return (
    <div>
      <HotelList hotels={hotels} />
    </div>
  );
};

export default HomePage;
