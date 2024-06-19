"use client";
import { Booking, Hotel, Room } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
import AmenityItem from "./AmenityItem";
import {
  AirVent,
  Bath,
  Bed,
  BedDouble,
  Castle,
  Home,
  Loader2,
  MountainSnow,
  Pencil,
  Ship,
  Trash,
  Trees,
  Tv,
  Users,
  UtensilsCrossed,
  VolumeX,
  Wand2,
  Wifi,
} from "lucide-react";
import { Separator } from "./ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import AddRoomForm from "./AddRoomForm";
import axios from "axios";
import { toast } from "./ui/use-toast";
import { DatePickerWithRange } from "./DataRangePicker";
import { addDays, differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { DateRange } from "react-day-picker";
import { Checkbox } from "./ui/checkbox";
import { useAuth } from "@clerk/nextjs";
import useBookRoom from "@/hooks/useBookRoom";

interface RoomCardProps {
  hotel?: Hotel & {
    rooms: Room[];
  };
  room: Room;
  bookings?: Booking[];
}

const RoomCard = ({ hotel, room, bookings = [] }: RoomCardProps) => {
  const { userId } = useAuth();
  const { setRoomData, paymentIntent, setClientSecret, setPaymentIntent } =
    useBookRoom();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();
  const [totalPrice, setTotalPrice] = useState(room.roomPrice);
  const [includeBreakFast, setIncludeBreakFast] = useState(false);
  const [day, setDay] = useState(1);
  const [bookingIsLoading, setBookingIsLoading] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const isHotelDetailsPage = pathname.includes("hotel-details");
  const isBookRoom = pathname.includes("book-room");

  useEffect(() => {
    if (date && date.from && date.to) {
      const dayCount = differenceInCalendarDays(date.to, date.from);

      setDay(dayCount);

      if (dayCount && room.roomPrice) {
        if (includeBreakFast && room.breakFastPrice) {
          setTotalPrice(
            dayCount * room.roomPrice + room.breakFastPrice * dayCount
          );
        } else {
          setTotalPrice(dayCount * room.roomPrice);
        }
      } else {
        setTotalPrice(room.roomPrice);
      }
    }
  }, [date, room.roomPrice, includeBreakFast]);

  const disableDate = useMemo(() => {
    let dates: Date[] = [];

    const roomBookings = bookings.filter(
      (booking) => booking.roomId === room.id && booking.paymentIntentId
    );

    roomBookings.forEach((booking) => {
      const range = eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [bookings]);

  const handelDialogueOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleDeleteRoom = async (room: Room) => {
    setIsLoading(true);
    const imageKey = room.image.substring(room.image.lastIndexOf("/") + 1);

    try {
      await axios.post("/api/uploadthing/delete", { imageKey });
      await axios.delete(`/api/room/${room.id}`);
      router.refresh();

      toast({
        variant: "success",
        description: "Successfully deleted",
      });

      setIsLoading(false);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong!",
      });
      setIsLoading(false);
    }
  };

  const handleBookRoom = () => {
    if (!userId)
      return toast({
        variant: "destructive",
        description: "Oops! Make sure you are logged in.",
      });

    if (!hotel?.userId)
      return toast({
        variant: "destructive",
        description: "Something went wrong, refresh the page and try again!",
      });

    if (date?.from && date?.to) {
      setBookingIsLoading(true);

      const bookingRoomData = {
        room,
        totalPrice,
        breakFastIncluded: includeBreakFast,
        startDate: date.from,
        endDate: date.to,
      };

      setRoomData(bookingRoomData);

      axios
        .post("/api/create-payment-intent", {
          booking: {
            hotelOwnerId: hotel.userId,
            hotelId: hotel.id,
            roomId: room.id,
            startDate: date.from,
            endDate: date.to,
            breakFastIncluded: includeBreakFast,
            totalPrice: totalPrice,
          },
          payment_intent_id: paymentIntent,
        })
        .then((res) => {
          setBookingIsLoading(false);
          if (res.status === 401) {
            return router.push("/login");
          }

          setClientSecret(res.data.client_secret);
          setPaymentIntent(res.data.id);
          router.push("/book-room");
        })
        .catch((error) => {
          setBookingIsLoading(false);

          toast({
            variant: "destructive",
            description: `ERROR! ${error.message}`,
          });
        });
    } else {
      return toast({
        variant: "destructive",
        description: "Oops! Select Date",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{room.title}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square overflow-hidden relative h-[200px] rounded-lg">
          <Image
            fill
            src={room.image}
            alt={room.title}
            className="object-cover bg-blue-400"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 content-start text-sm">
          <AmenityItem>
            <Bed className="h-4 w-4" />
            {room.bedCount} Bed{"'s"}
          </AmenityItem>
          <AmenityItem>
            <Users className="h-4 w-4" />
            {room.guestCount} Guest{"'s"}
          </AmenityItem>
          <AmenityItem>
            <Bath className="h-4 w-4" />
            {room.bathroomCount} Bathroom{"'s"}
          </AmenityItem>
          {!!room.kingBed && (
            <AmenityItem>
              <BedDouble className="h-4 w-4" />
              {room.kingBed} King Bed{"'s"}
            </AmenityItem>
          )}
          {!!room.quennBed && (
            <AmenityItem>
              <Bath className="h-4 w-4" />
              {room.quennBed} Queen Bed{"'s"}
            </AmenityItem>
          )}
          {room.roomeService && (
            <AmenityItem>
              <UtensilsCrossed className="h-4 w-4" />
              Room Services{"'s"}
            </AmenityItem>
          )}
          {room.TV && (
            <AmenityItem>
              <Tv className="h-4 w-4" />
              TV
            </AmenityItem>
          )}
          {room.balcony && (
            <AmenityItem>
              <Home className="h-4 w-4" />
              Balcony
            </AmenityItem>
          )}
          {room.freeWifi && (
            <AmenityItem>
              <Wifi className="h-4 w-4" />
              Free Wifi
            </AmenityItem>
          )}
          {room.cityView && (
            <AmenityItem>
              <Castle className="h-4 w-4" />
              City View
            </AmenityItem>
          )}
          {room.oceanView && (
            <AmenityItem>
              <Ship className="h-4 w-4" />
              Ocean View
            </AmenityItem>
          )}
          {room.forestView && (
            <AmenityItem>
              <Trees className="h-4 w-4" />
              Forest View
            </AmenityItem>
          )}
          {room.mountineView && (
            <AmenityItem>
              <MountainSnow className="h-4 w-4" />
              Mountain View
            </AmenityItem>
          )}
          {room.airCondition && (
            <AmenityItem>
              <AirVent className="h-4 w-4" />
              Air Condition
            </AmenityItem>
          )}
          {room.soundProofed && (
            <AmenityItem>
              <VolumeX className="h-4 w-4" />
              Sound Proofed
            </AmenityItem>
          )}
        </div>
        <Separator />
        <div className="flex gap-4 justify-between">
          <div>
            Room Price: <span className="font-bold">${room.roomPrice}</span>{" "}
            <span className="text-xs">24hrs</span>
          </div>
          {!!room.breakFastPrice && (
            <div>
              BreakFast Price:{" "}
              <span className="font-bold">${room.breakFastPrice}</span>
            </div>
          )}
        </div>
      </CardContent>
      {!isBookRoom && (
        <CardFooter>
          {isHotelDetailsPage ? (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="mb-2">
                  Select days that you will spend in this room
                </h1>
                <DatePickerWithRange
                  disableDate={disableDate}
                  setDate={setDate}
                  date={date}
                />
              </div>
              {room.breakFastPrice > 0 && (
                <div>
                  <div className="mb-2">
                    Do you what to be served breakfast each day
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      onCheckedChange={(value) => setIncludeBreakFast(!!value)}
                    />
                    <label className="text-sm">Include BreakFast</label>
                  </div>
                </div>
              )}
              <div>
                Total Price: <span className="font-bold">${totalPrice}</span>{" "}
                for <span className="font-bold">{day} Days</span>
              </div>
              {
                <Button
                  disabled={bookingIsLoading}
                  onClick={() => handleBookRoom()}
                >
                  {bookingIsLoading ? (
                    <Loader2 className="w-4 h-4 mr-2" />
                  ) : (
                    <Wand2 className="w-4 h-4 mr-2" />
                  )}
                  {bookingIsLoading ? "Loading..." : "Book Room"}
                </Button>
              }
            </div>
          ) : (
            <div className="flex w-full justify-between">
              <Button
                onClick={() => handleDeleteRoom(room)}
                className="flex items-center gap-2"
                type="button"
                variant="ghost"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash className="w-4 h-4" />
                    Delete
                  </>
                )}
              </Button>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                  <Button
                    type="button"
                    variant="outline"
                    className="max-w-[150px]"
                  >
                    <Pencil className="mr-2 h-4 w-4" /> Update Room
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[900px] w-[90%]">
                  <DialogHeader className="px-2">
                    <DialogTitle>Update Room</DialogTitle>
                    <DialogDescription>
                      Make changes to this room
                    </DialogDescription>
                  </DialogHeader>
                  <AddRoomForm
                    hotel={hotel}
                    handelDialogueOpen={handelDialogueOpen}
                    room={room}
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default RoomCard;
