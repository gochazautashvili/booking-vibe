"use client";

import { usePathname, useRouter } from "next/navigation";
import { HotelWithRooms } from "./AddHotelForm";
import { cn } from "@/lib/utils";
import Image from "next/image";
import AmenityItem from "./AmenityItem";
import { Dumbbell, MapPin, Waves } from "lucide-react";
import useLocation from "@/hooks/useLoaction";
import { Button } from "./ui/button";

const HotelCard = ({ hotel }: { hotel: HotelWithRooms }) => {
  const pathname = usePathname();
  const router = useRouter();

  const isMyHotel = pathname.includes("my-hotels");

  const { getCountryByCode } = useLocation();
  const country = getCountryByCode(hotel.country);

  return (
    <div
      className={cn(
        "col-span-1 cursor-pointer transition hover:scale-105",
        isMyHotel && "cursor-default"
      )}
      onClick={() => !isMyHotel && router.push(`/hotel-details/${hotel.id}`)}
    >
      <div className="flex gap-2 bg-background/50 border border-primary/10 rounded-lg">
        <div className="flex-1 aspect-square overflow-hidden relative w-full h-[210px] rounded-s-lg">
          <Image
            fill
            src={hotel.image}
            alt={hotel.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between h-[210px] gap-1 px-1 py-2 text-sm">
          <h3 className="font-semibold text-xl">{hotel.title}</h3>
          <p className="text-primary/90">
            {hotel.description.substring(0, 45)}...
          </p>
          <div className="text-primary/90">
            <AmenityItem>
              <MapPin className="w-4 h-4" /> {country?.name}, {hotel.city}
            </AmenityItem>
            {hotel.swimmingPool && (
              <AmenityItem>
                <Waves className="w-4 h-4" /> Pool
              </AmenityItem>
            )}
            {hotel.gym && (
              <AmenityItem>
                <Dumbbell className="w-4 h-4" /> Gym
              </AmenityItem>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {hotel?.rooms[1]?.roomPrice && (
                <>
                  <div className="font-semibold">
                    ${hotel.rooms[1].roomPrice}
                  </div>
                  <div className="text-xs">/ 24hrs</div>
                </>
              )}
            </div>
            {isMyHotel && (
              <Button
                variant="outline"
                onClick={() => router.push(`/hotel/${hotel.id}`)}
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
