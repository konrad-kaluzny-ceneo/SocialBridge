"use client";

import { useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon } from "lucide-react";
import NavLink from "./NavLink";
import { Button } from "@/components/ui/button";

type Props = {
  publicLinks: { href: string; label: string }[];
  privateLinks: { href: string; label: string }[];
  userId: string | null;
};

export default function NavbarMobile({
  publicLinks,
  privateLinks,
  userId,
}: Props) {
  const closeDialogButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <MenuIcon className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="absolute left-0 top-0 mt-2 w-[94vw] bg-white sm:w-[97vw]"
        align="start"
      >
        <DropdownMenuGroup className="flex flex-col gap-2">
          {publicLinks.map((link) => (
            <DropdownMenuItem
              key={link.href}
              className="flex cursor-pointer flex-col"
            >
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                refToClose={closeDialogButtonRef}
              ></NavLink>
            </DropdownMenuItem>
          ))}

          {userId &&
            privateLinks.map((link) => (
              <DropdownMenuItem
                key={link.href}
                className="flex cursor-pointer flex-col"
              >
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  refToClose={closeDialogButtonRef}
                ></NavLink>
              </DropdownMenuItem>
            ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
