"use client";
import { UserButton, useAuth } from "@clerk/nextjs";
import Container from "./Container";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import SearchInput from "./SearchInput";
import ModeToggle from "./ThemeToggle";
import NavMenu from "./NavMenu";

const Navbar = () => {
  const router = useRouter();
  const { userId } = useAuth();

  return (
    <header className="sticky z-10 top-0 border border-b-primary/10 bg-secondary">
      <Container>
        <nav className="flex justify-between items-center">
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-1 cursor-pointer"
          >
            <Image src="/icon.png" alt="logo" width={30} height={30} />
            <div className="font-bold text-xl md:block hidden">Travel Vibe</div>
          </div>
          <SearchInput />
          <div className="flex md:gap-3 items-center">
            <ModeToggle />
            <NavMenu />
            <UserButton afterSignOutUrl="/" />
            {!userId && (
              <>
                <Button
                  onClick={() => router.push("/sign-in")}
                  variant="outline"
                  size="sm"
                  className="mr-2"
                >
                  Sign in
                </Button>
                <Button onClick={() => router.push("/sign-in")} size="sm">
                  Sign up
                </Button>
              </>
            )}
          </div>
        </nav>
      </Container>
    </header>
  );
};

export default Navbar;
