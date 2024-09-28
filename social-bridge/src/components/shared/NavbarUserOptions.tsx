import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function NavbarUserOptions() {
  return (
    <>
      <SignedOut>
        <Link href="/sign-in" className={buttonVariants({ variant: "ghost" })}>
          Zaloguj się
        </Link>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
}
