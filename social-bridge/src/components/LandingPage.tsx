"use client";

import WrapperMaxWidth from "@/components/shared/WrapperMaxWidth";
import H1Backgrounded from "@/components/shared/H1Backgrounded";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function LandingPage() {
  const HIGHLIGHTS = [
    "lorem ipsum amet dolor ",
    "ipsum",
    "dolor",
  ];

  return (
    <WrapperMaxWidth className="flex flex-col items-center">
      <div className="flex flex-col items-center md:flex-row-reverse">
        <Image
          width={1280}
          height={1280}
          className="h-44 rounded-md object-cover drop-shadow-lg md:h-96"
          src={"/images/default.jpg"}
          alt="default image"
          priority={true}
        />

        <div className="flex flex-col items-center md:items-start text-balance text-center md:text-left">
          <h1 className="dh dh-1">
            Wspólnie zmieniajmy świat <H1Backgrounded>na lepsze</H1Backgrounded>
          </h1>
          <p className="mt-4 text-lg">
            Biznes i organizacje pozarządowe w jednym miejscu.
          </p>
          <ul className="mt-8 flex flex-col space-y-2 font-medium">
            {HIGHLIGHTS.map((highlight, index) => (
              <li key={index} className={cn("flex gap-1.5")}>
                <CheckIcon className="h-5 w-5 shrink-0 text-primary" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <Link
          className={buttonVariants({
            size: "lg",
            className: "mx-auto mt-8",
          })}
          href={`/sign-in`}
        >
          Zacznij pomagać lub znajdź pomoc
          <ArrowRightIcon className="ml-1.5 h-4 w-4" />
        </Link>
      </div>
    </WrapperMaxWidth>
  );
}
