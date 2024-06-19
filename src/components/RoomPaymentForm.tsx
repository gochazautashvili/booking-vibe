import useBookRoom from "@/hooks/useBookRoom";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { FormEvent, useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import { Separator } from "./ui/separator";
import moment from "moment";
import { Button } from "./ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Terminal } from "lucide-react";
import { Booking } from "@prisma/client";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";

interface Props {
  clientSecret: string;
  handleSetPaymentSuccess: (value: boolean) => void;
}

type DateRangesType = {
  startDate: Date;
  endDate: Date;
};

const hasOverlap = (
  startDate: Date,
  endDate: Date,
  dateRange: DateRangesType[]
) => {
  const targetInterval = {
    start: startOfDay(new Date(startDate)),
    end: endOfDay(new Date(endDate)),
  };

  for (const range of dateRange) {
    const rangeStart = startOfDay(new Date(range.startDate));
    const rangeEnd = endOfDay(new Date(range.endDate));

    if (
      isWithinInterval(targetInterval.start, {
        start: rangeStart,
        end: rangeEnd,
      }) ||
      isWithinInterval(targetInterval.end, {
        start: rangeStart,
        end: rangeEnd,
      }) ||
      (targetInterval.start < rangeStart && targetInterval.end > rangeEnd)
    ) {
      return true;
    }
  }

  return false;
};

const RoomPaymentForm = ({ clientSecret, handleSetPaymentSuccess }: Props) => {
  const { bookingRoomData, resetBookRoom } = useBookRoom();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!stripe) return;
    if (!clientSecret) return;

    handleSetPaymentSuccess(false);
    setIsLoading(false);
  }, [stripe]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements || !bookingRoomData) {
      return;
    }

    try {
      const bookings = await axios.get(
        `/api/booking/${bookingRoomData.room.id}`
      );

      const roomBookingDates = bookings.data.map((booking: Booking) => {
        return {
          startDate: booking.startDate,
          endDate: booking.endDate,
        };
      });

      const overlapFound = hasOverlap(
        bookingRoomData.startDate,
        bookingRoomData.endDate,
        roomBookingDates
      );

      if (overlapFound) {
        setIsLoading(false);
        return toast({
          variant: "destructive",
          description:
            "Oops! Some of this days you are trying to book have already been reserved. Please go back and select different dates or rooms",
        });
      }

      stripe
        .confirmPayment({ elements, redirect: "if_required" })
        .then((result) => {
          if (!result.error) {
            axios
              .patch(`/api/booking/${result.paymentIntent.id}`)
              .then((res) => {
                toast({
                  variant: "success",
                  description: "Room Reserved!",
                });

                router.refresh();
                resetBookRoom();
                handleSetPaymentSuccess(true);
                setIsLoading(false);
              })
              .catch(() => {
                toast({
                  variant: "destructive",
                  description: "Something went wrong!",
                });
                setIsLoading(false);
              });
          } else {
            setIsLoading(false);
          }
        });
    } catch (error) {
      setIsLoading(false);
    }
  };

  if (!bookingRoomData?.startDate || !bookingRoomData?.endDate) {
    return <div>Error: Missing reservation dates...</div>;
  }

  const startDate = moment(bookingRoomData?.startDate).format("MMMM Do YYYY");
  const endDate = moment(bookingRoomData?.endDate).format("MMMM Do YYYY");

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <h2 className="font-semibold mb-2 text-lg">Billing Address</h2>
      <AddressElement
        options={{
          mode: "billing",
        }}
      />
      <h2 className="font-semibold mt-4 mb-2 text-lg">Payment Information</h2>
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <div className="flex flex-col gap-1">
        <Separator />
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold mb-1 text-lg">Your Booking Summery</h2>
          <div>You will check-in on {startDate} at 5PM</div>
          <div>You will check-out on {endDate} at 5PM</div>
          {bookingRoomData?.breakFastIncluded && (
            <div>You will served breakfast each day at 8PM</div>
          )}
        </div>
        <Separator />
        <div className="font-bold text-lg">
          {bookingRoomData?.breakFastIncluded && (
            <div className="mt-2">
              Breakfast Price: ${bookingRoomData.room.breakFastPrice} /day
            </div>
          )}
          Total Price: ${bookingRoomData?.totalPrice}
        </div>
      </div>
      {isLoading && (
        <Alert className="bg-indigo-600 text-white my-3">
          <Terminal className="h-4 w-4 stroke-white" />
          <AlertTitle>One last step!</AlertTitle>
          <AlertDescription>
            Your Payment Is Processing....
            <div>
              Payment Processing... Please Stay on this page as we process your
              payment
            </div>
          </AlertDescription>
        </Alert>
      )}
      <Button disabled={isLoading} className="mt-2">
        {isLoading ? "Processing Payment..." : "Pay Now"}
      </Button>
    </form>
  );
};

export default RoomPaymentForm;
