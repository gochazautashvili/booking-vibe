"use client";
import { RoomFormSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Hotel, Room } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import Image from "next/image";
import { UploadButton } from "@/utils/uploadthing";
import { toast } from "./ui/use-toast";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Loader2, PencilLine, XCircle } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AddRoomFormProps {
  hotel?: Hotel & {
    rooms: Room[];
  };
  room?: Room;
  handelDialogueOpen: () => void;
}

const AddRoomForm = ({ hotel, room, handelDialogueOpen }: AddRoomFormProps) => {
  const [imagesIsDeleting, setImageIsDeleting] = useState(false);
  const [image, setImage] = useState<string | undefined>(room?.image);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof RoomFormSchema>>({
    resolver: zodResolver(RoomFormSchema),
    defaultValues: room || {
      title: "",
      description: "",
      bedCount: 0,
      guestCount: 0,
      bathroomCount: 0,
      kingBed: 0,
      quennBed: 0,
      image: "",
      breakFastPrice: 0,
      roomPrice: 0,
      roomeService: false,
      TV: false,
      balcony: false,
      freeWifi: false,
      cityView: false,
      oceanView: false,
      forestView: false,
      mountineView: false,
      airCondition: false,
      soundProofed: false,
    },
  });

  useEffect(() => {
    if (typeof image === "string") {
      form.setValue("image", image, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [image]);

  const handelImageDelete = (image: string) => {
    setImageIsDeleting(true);
    const imageKey = image.substring(image.lastIndexOf("/") + 1);

    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then((res) => {
        if (res.data.success) {
          setImage("");
          toast({
            variant: "success",
            description: "Image removed",
          });
        }
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          description: "Something went wrong",
        });
      })
      .finally(() => {
        setImageIsDeleting(false);
      });
  };

  const onSubmit = (values: z.infer<typeof RoomFormSchema>) => {
    setIsLoading(true);

    if (hotel && room) {
      axios
        .patch(`/api/room/${room.id}`, values)
        .then((res) => {
          toast({
            variant: "success",
            description: "Room Updated!",
          });

          router.refresh();
          setIsLoading(false);
          handelDialogueOpen();
        })
        .catch(() => {
          toast({
            variant: "destructive",
            description: "Something went wrong!",
          });

          setIsLoading(false);
        });
    } else {
      if (!hotel?.id) return;

      axios
        .post("/api/room", { ...values, hotelId: hotel.id })
        .then((res) => {
          toast({
            variant: "success",
            description: "Room Created!",
          });

          router.refresh();
          setIsLoading(false);
          handelDialogueOpen();
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            description: "Something went wrong!",
          });

          setIsLoading(false);
        });
    }
  };

  return (
    <div className="max-h-[75vh] overflow-y-auto px-2">
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Title *</FormLabel>
                <FormDescription>Provide a room name.</FormDescription>
                <FormControl>
                  <Input placeholder="Bouble Room" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Description *</FormLabel>
                <FormDescription>
                  Is there anything special about this room?
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="Have a beautiful view of the ocean while in this room!"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormLabel>Choose Room Amenities</FormLabel>
            <FormDescription>
              What makes this room a good choice?
            </FormDescription>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <FormField
                control={form.control}
                name="roomeService"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>24Hrs Room Service</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="TV"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>TV</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="balcony"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Balcony</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freeWifi"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Free Wifi</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cityView"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>City View</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="oceanView"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Ocean View</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="forestView"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Forest View</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mountineView"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Mountie View</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="airCondition"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Air Condition</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="soundProofed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Sound Proofed</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload an Image</FormLabel>
                <FormDescription>
                  Choose an image that will show-case your room nicely.
                </FormDescription>
                <FormControl>
                  {image ? (
                    <div className="relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4">
                      <Image
                        fill
                        src={image}
                        alt="hotel image"
                        className="object-contain"
                      />
                      <Button
                        onClick={() => handelImageDelete(image)}
                        className="absolute -right-3 top-0"
                        type="button"
                        size="icon"
                        variant="ghost"
                      >
                        {imagesIsDeleting ? <Loader2 /> : <XCircle />}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center max-w-[400px] p-12 border-2 border-dashed border-primary/50 rounded mt-4">
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          setImage(res[0].url);
                          toast({
                            variant: "success",
                            description: "Upload Completed",
                          });
                        }}
                        onUploadError={(error: Error) => {
                          toast({
                            variant: "destructive",
                            description: `ERROR: ${error.message}`,
                          });
                        }}
                      />
                    </div>
                  )}
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-6">
            <div className="flex-1 flex flex-col gap-6">
              <FormField
                control={form.control}
                name="roomPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Price in USD *</FormLabel>
                    <FormDescription>
                      State this price for staying this room for 24Hrs?
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bedCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bed Count *</FormLabel>
                    <FormDescription>
                      How many beds are available in this room.
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={8} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="guestCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guest Count *</FormLabel>
                    <FormDescription>
                      How many guests are available in this room.
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={20} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bathroomCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathroom Count *</FormLabel>
                    <FormDescription>
                      How many bathrooms are available in this room.
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={8} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <FormField
                control={form.control}
                name="breakFastPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>break Fast Price in USD</FormLabel>
                    <FormDescription>
                      State this price for staying this room for 24Hrs?
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kingBed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>King Bed Count</FormLabel>
                    <FormDescription>
                      How many king beds are available in this room.
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={8} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quennBed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Queen Bed Count *</FormLabel>
                    <FormDescription>
                      How many Queen Bed are available in this room.
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={20} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="pt-4 pb-2">
            {room ? (
              <Button
                type="button"
                disabled={isLoading}
                className="max-w-[150px]"
                onClick={form.handleSubmit(onSubmit)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4" /> Updating...
                  </>
                ) : (
                  <>
                    <PencilLine className="mr-2 h-4 w-4" />
                    Update Hotel
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                disabled={isLoading}
                className="max-w-[150px]"
                onClick={form.handleSubmit(onSubmit)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4" /> Creating...
                  </>
                ) : (
                  <>
                    <PencilLine className="mr-2 h-4 w-4" /> Create Room
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddRoomForm;
