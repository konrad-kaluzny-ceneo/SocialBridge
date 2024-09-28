import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Metadata } from "next";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  return `${process.env.NEXT_PUBLIC_SERVER_URL}${path}`;
}

export function formatDateTime(date: Date): string {
  // Define months in Polish
  const months = [
    "sty",
    "lut",
    "mar",
    "kwi",
    "maj",
    "cze",
    "lip",
    "sie",
    "wrz",
    "paź",
    "lis",
    "gru",
  ];

  // Get the day of the month
  const day = date.getDate();

  // Get the month and format it in Polish
  const month = months[date.getMonth()];

  // Get the hours and minutes
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Pad the minutes with leading zero if needed
  const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Format the date and time
  return `${day} ${month}, ${hours}:${paddedMinutes}`;
}

export function getDateTime(date: Date, timeString: string) {
  // Extract date components from the Date object
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // Combine date and time into a proper string without the timezone part
  const combinedString = `${year}-${month}-${day}T${timeString}:00`;

  const combined = new Date(combinedString);

  return combined;
}

export function shrinkText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;

  // split to max length, but not in the middle of the word
  const words = text.split(" ");
  let result = "";
  for (const word of words) {
    if (result.length + word.length > maxLength) break;
    result += word + " ";
  }
  return result.trim() + "...";
}

export function constructMetadata({
  title = process.env.METADATA_TITLE,
  description = process.env.METADATA_DESCRIPTION,
  image = "/thumbnail.png",
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@twitterAccount",
    },
    icons,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL!),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
