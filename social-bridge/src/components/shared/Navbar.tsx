import WrapperMaxWidth from "./WrapperMaxWidth";
import { cn } from "@/lib/utils";
import NavbarUserOptions from "./NavbarUserOptions";
import { auth } from "@clerk/nextjs/server";
import { checkRole } from "@/lib/server-utils";
import NavLink from "./NavLink";
import NavbarMobile from "./NavbarMobile";
import Logo from "./Logo";

export default async function Navbar() {
  const { userId } = auth();
  const isAdmin = userId ? checkRole("admin") : false;

  const publicLinks: { href: string; label: string }[] = [
    { href: "/organizations", label: "Organizacje" },
  ];

  const privateLinks: { href: string; label: string }[] = [
    { href: "/init-organization", label: "Twoja wizytówka" },
    { href: "/events", label: "Wydarzenia" },
    { href: "/chat", label: "Czaty" },
  ];

  return (
    <nav
      className={cn(
        "sticky top-0 z-[100] backdrop-blur-lg",
        "w-full border-b border-zinc-200 bg-white/75",
      )}
    >
      <WrapperMaxWidth>
        <div className="flex h-14 items-center justify-between">
          <div className="flex md:hidden">
            <NavbarMobile
              publicLinks={publicLinks}
              privateLinks={privateLinks}
              userId={userId}
            />
          </div>

          <div className="items-center">
            <Logo />
          </div>

          <div className="flex items-center justify-end space-x-4">
            <div className="hidden items-center gap-4 md:flex">
              {publicLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                ></NavLink>
              ))}

              {userId &&
                privateLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                  ></NavLink>
                ))}

              <div className="hidden h-8 w-px bg-zinc-200 md:block" />
            </div>
            <div className="justify-self-end">
              <NavbarUserOptions />
            </div>
          </div>
        </div>
      </WrapperMaxWidth>
    </nav>
  );
}
