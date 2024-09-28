"use client";

import WrapperMaxWidth from "./WrapperMaxWidth";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  const pathsToMinimize = ["/sign-up", "/sign-in"];
  const pathname = usePathname();

  if (pathname && pathsToMinimize.find((p) => pathname.includes(p)) != null)
    return null;

  return (
    <footer className="flex-grow-0 bg-slate-100">
      <WrapperMaxWidth>
        <div className="py-10 md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Wszystkie prawa zastrzeżone
            </p>
          </div>

          <div className="pb-2 pt-4">
            <div className="flex justify-center">
              <Logo />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center md:mt-0">
            <div className="flex space-x-8">
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-slate-600"
              >
                Regulamin
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-slate-600"
              >
                Polityka prywatności
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-slate-600"
              >
                Kontakt
              </Link>
            </div>
          </div>
        </div>
      </WrapperMaxWidth>
    </footer>
  );
}
