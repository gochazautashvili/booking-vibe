"use client";
import { FormSchema } from "@/schemas/schemas";
import { Hotel, Room } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { UploadButton } from "@/utils/uploadthing";
import { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import Image from "next/image";
import { Button } from "./ui/button";
import { Eye, Loader2, PencilLine, Plus, Trash, XCircle } from "lucide-react";
import axios from "axios";
import useLocation from "@/hooks/useLoaction";
import { City, ICity, IState } from "country-state-city";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Terminal } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddRoomForm from "./AddRoomForm";
import { Separator } from "./ui/separator";
import RoomCard from "./RoomCard";

interface AddHotelFormProps {
  hotel: HotelWithRooms | null;
}

export type HotelWithRooms = Hotel & {
  rooms: Room[];
};

const AddHotelForm = ({ hotel }: AddHotelFormProps) => {
  const [imagesIsDeleting, setImageIsDeleting] = useState(false);
  const [image, setImage] = useState<string | undefined>(hotel?.image);
  const [isLoading, setIsLoading] = useState(false);
  const [isHotelDeleting, setIsHotelDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const { getAllCountries, getCountryStates, getStateCities } = useLocation();
  const countries = getAllCountries();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: hotel || {
      title: "",
      description: "",
      image: "",
      country: "",
      state: "",
      city: "",
      locationDescription: "",
      gym: false,
      spa: false,
      bar: false,
      laundry: false,
      shopping: false,
      freeWifi: false,
      movieNights: false,
      swimmingPool: false,
      coffeeShop: false,
    },
  });

  useEffect(() => {
    const selectedCountry = form.watch("country");
    const countryStates = getCountryStates(selectedCountry);

    if (countryStates) {
      setStates(countryStates);
    }
  }, [form.watch("country")]);

  useEffect(() => {
    const selectedCountry = form.watch("country");
    const selectedState = form.watch("state");
    const stateCities = getStateCities(selectedCountry, selectedState);

    if (stateCities) {
      setCities(stateCities);
    }
  }, [form.watch("country"), form.watch("state")]);

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

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    if (hotel) {
      axios
        .patch(`/api/hotel/${hotel.id}`, values)
        .then((res) => {
          toast({
            variant: "success",
            description: "Hotel Updated!",
          });

          router.push(`/hotel/${res.data.id}`);
          setIsLoading(false);
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            description: "Something went wrong!",
          });

          setIsLoading(false);
        });
    } else {
      axios
        .post("/api/hotel", values)
        .then((res) => {
          toast({
            variant: "success",
            description: "Hotel Created!",
          });

          router.push(`/hotel/${res.data.id}`);
          setIsLoading(false);
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

  const handleDeleteHotel = async (hotel: HotelWithRooms) => {
    setIsHotelDeleting(true);
    const getImageKey = (src: string) =>
      src.substring(src.lastIndexOf("/") + 1);

    try {
      const imageKey = getImageKey(hotel.image);
      await axios.post("/api/uploadthing/delete", { imageKey });
      await axios.delete(`/api/hotel/${hotel.id}`);

      setIsHotelDeleting(false);
      toast({
        variant: "success",
        description: "Hotel Delete!",
      });

      router.push("/hotel/new");
    } catch (error) {
      setIsHotelDeleting(false);

      toast({
        variant: "destructive",
        description: "Hotel deletion could not be completed!?",
      });
    }
  };

  const handelDialogueOpen = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <h3 className="text-lg font-semibold">
            {hotel ? "Update your hotel" : "Describe your hotel"}
          </h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Title</FormLabel>
                    <FormDescription>Provide your hotel name.</FormDescription>
                    <FormControl>
                      <Input placeholder="Beach Hotel" {...field} />
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
                    <FormLabel>Hotel Description</FormLabel>
                    <FormDescription>
                      provide a detailed description of your description.
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Beach Hotel is parked with many awesome amenitie!"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormLabel>Choose Amenities</FormLabel>
                <FormDescription>
                  Choose Amenities popular in your hotel.
                </FormDescription>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <FormField
                    control={form.control}
                    name="gym"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Gym</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="spa"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Spa</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bar"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Bar</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="laundry"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Laundry</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="restaurant"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Restaurant</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shopping"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Shopping</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="freeParking"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Free Parking</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bikeRental"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Bike Rental</FormLabel>
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
                    name="movieNights"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Movie Nights</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="swimmingPool"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Swimming Pool</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coffeeShop"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Coffee Shop</FormLabel>
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
                      Choose an image that will show-case your hotel nicely.
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
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Country *</FormLabel>
                      <FormDescription>
                        In which country is your property located?
                      </FormDescription>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a Country"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => {
                            return (
                              <SelectItem
                                key={country.isoCode}
                                value={country.isoCode}
                              >
                                {country.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select State</FormLabel>
                      <FormDescription>
                        In which State is your property located?
                      </FormDescription>
                      <Select
                        disabled={isLoading || states.length < 1}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a State"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => {
                            return (
                              <SelectItem
                                key={state.isoCode}
                                value={state.isoCode}
                              >
                                {state.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select City</FormLabel>
                    <FormDescription>
                      In which City is your property located?
                    </FormDescription>
                    <Select
                      disabled={isLoading || cities.length < 1}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a City"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => {
                          return (
                            <SelectItem key={city.name} value={city.name}>
                              {city.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="locationDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Description</FormLabel>
                    <FormDescription>
                      provide a detailed Location of your description.
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Location at the very end of the beach road!"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {hotel && !hotel.rooms.length && (
                <Alert className="bg-indigo-600 text-white">
                  <Terminal className="h-4 w-4 stroke-white" />
                  <AlertTitle>One last step!</AlertTitle>
                  <AlertDescription>
                    Your hotel was created successfully
                    <div>
                      Please add some rooms to complete your hotel setup!
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex justify-between gap-2 flex-wrap">
                {/* delete */}
                {hotel && (
                  <Button
                    className="max-w-[150px]"
                    variant="ghost"
                    onClick={() => handleDeleteHotel(hotel)}
                    type="button"
                    disabled={isHotelDeleting || isLoading}
                  >
                    {isHotelDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4" /> Deleting...
                      </>
                    ) : (
                      <>
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </>
                    )}
                  </Button>
                )}

                {/* view */}
                {hotel && (
                  <Button
                    onClick={() => router.push(`/hotel-details/${hotel.id}`)}
                    variant="outline"
                    type="button"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                )}

                {/* add rooms */}
                {hotel && (
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger>
                      <Button
                        type="button"
                        variant="outline"
                        className="max-w-[150px]"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Room
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[900px] w-[90%]">
                      <DialogHeader className="px-2">
                        <DialogTitle>Add a Room</DialogTitle>
                        <DialogDescription>
                          Add details about a room in your hotel.
                        </DialogDescription>
                      </DialogHeader>
                      <AddRoomForm
                        hotel={hotel}
                        handelDialogueOpen={handelDialogueOpen}
                      />
                    </DialogContent>
                  </Dialog>
                )}

                {/* create */}
                {hotel ? (
                  <Button
                    disabled={isLoading || isHotelDeleting}
                    className="max-w-[150px]"
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
                    disabled={isLoading || isHotelDeleting}
                    className="max-w-[150px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4" /> Creating...
                      </>
                    ) : (
                      <>
                        <PencilLine className="mr-2 h-4 w-4" /> Create Hotel
                      </>
                    )}
                  </Button>
                )}
              </div>
              {hotel && !!hotel.rooms.length && (
                <div>
                  <Separator />
                  <h3 className="text-lg font-semibold my-4">Hotel Rooms</h3>
                  <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
                    {hotel.rooms.map((room) => {
                      return (
                        <RoomCard key={room.id} hotel={hotel} room={room} />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddHotelForm;
