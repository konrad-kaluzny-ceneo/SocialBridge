import { Montserrat } from "next/font/google";
import "./globals.css";
import WrapperProviders from "@/components/shared/WrapperProviders";
import { cn, constructMetadata } from "@/lib/utils";
import "simplebar-react/dist/simplebar.min.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/shared/Navbar";
const font = Montserrat({ subsets: ["latin"] });

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          font.className,
          "grainy-light min-h-screen font-sans text-slate-800 antialiased",
        )}
      >
        <WrapperProviders>
          <Navbar />

          <main className="flex min-h-[calc(100vh-3.5rem-1px)]">
            {children}
          </main>

          <Toaster />
        </WrapperProviders>
      </body>
    </html>
  );
}
