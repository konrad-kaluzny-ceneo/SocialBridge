"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/button";

type Props = {
  href: string;
  label: string;
  refToClose?: React.RefObject<HTMLButtonElement>;
};

export default function NavLink({ href, label, refToClose }: Props) {
  const pathname = usePathname();

  const isActive = pathname === href;

  const handleClick = () => {
    if (refToClose) {
      refToClose.current?.click();
    }
  };

  return (
    <Button
      as={Link}
      href={href}
      variant="light"
      className={cn("font-semibold", isActive && "text-primary")}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
}
