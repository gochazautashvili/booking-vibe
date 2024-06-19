"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookOpenCheck, ChevronsUpDown, Hotel, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NavMenu() {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <ChevronsUpDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="flex gap-3 items-center cursor-pointer"
          onClick={() => router.push("/hotel/new")}
        >
          <Plus size={15} /> <span>Add Hotel</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-3 items-center cursor-pointer"
          onClick={() => router.push("/my-hotels")}
        >
          <Hotel size={15} /> <span>My Hotels</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-3 items-center cursor-pointer"
          onClick={() => router.push("/my-bookings")}
        >
          <BookOpenCheck size={15} /> <span>My Bookings</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
