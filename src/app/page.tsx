import HotelList from "@/components/HotelList";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export interface HomeProps {
  searchParams: {
    title: string;
    country: string;
    state: string;
    city: string;
  };
}

const HomePage = ({ searchParams }: HomeProps) => {
  return (
    <Suspense
      key={
        searchParams.title ||
        searchParams.city ||
        searchParams.state ||
        searchParams.country
      }
      fallback={<Loader2 className="animate-spin mx-auto my-10" />}
    >
      <HotelList searchParams={searchParams} />
    </Suspense>
  );
};

export default HomePage;
