import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { SignUp } from "@clerk/nextjs";
import WrapperMaxWidth from "@/components/shared/WrapperMaxWidth";

export default function SignUpPage() {
  return (
    <WrapperMaxWidth>
      <Link
        href="/"
        className={cn(buttonVariants({ variant: "ghost" }), "mt-4")}
      >
        <ChevronLeftIcon className="mr-2 h-4 w-4" />
        Start
      </Link>

      <div className="mx-auto mt-12 flex w-full max-w-sm items-center justify-center lg:mt-24">
        <SignUp />
      </div>
    </WrapperMaxWidth>
  );
}
