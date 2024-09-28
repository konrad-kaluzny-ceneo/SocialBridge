"use client";

import WrapperMaxWidth from "@/components/shared/WrapperMaxWidth";
import H1Backgrounded from "@/components/shared/H1Backgrounded";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { User } from "@clerk/nextjs/server";

export interface LandingPageProps {
  shouldShowLoginButton: boolean;
}

export default function LandingPage({
  shouldShowLoginButton,
}: LandingPageProps) {
  const HIGHLIGHTS = [
    "Darmowa rejestracja i własna wizytówka firmy",
    "Nawiązywanie współprac nigdy nie było takie proste",
    "Przeprowadzimy Cię przez proces krok po kroku",
    "Wsparcie technologii AI",
    "Dostęp do świata biznesu i organizacji pozarządowych",
  ];

  return (
    <WrapperMaxWidth className="flex flex-col items-center">
      <div className="flex flex-col items-center xl:flex-row-reverse">
        <Image
          width={1280}
          height={1280}
          className="h-44 rounded-md object-cover drop-shadow-lg xl:aspect-square xl:h-96 xl:w-96"
          src={"/images/hands3.jpg"}
          alt="hands"
          priority={true}
        />

        <div className="flex flex-col items-center text-balance text-center xl:items-start xl:text-left">
          <h1 className="text-balance py-5 text-center text-5xl font-bold !leading-tight tracking-tight xl:text-6xl xl:text-left">
            Wspólnie zmieniajmy świat <H1Backgrounded>na lepsze</H1Backgrounded>
          </h1>
          <p className="mt-4 text-lg">
            Biznes i organizacje pozarządowe nigdy nie były bliżej siebie!
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

      {shouldShowLoginButton && (
        <div className="flex items-center justify-center">
          <Link
            className={buttonVariants({
              size: "lg",
              className: "mx-auto mt-8",
            })}
            href={`/sign-in`}
          >
            Zaloguj się i zacznij pomagać
            <ArrowRightIcon className="ml-1.5 h-4 w-4" />
          </Link>
        </div>
      )}
    </WrapperMaxWidth>
  );
}
