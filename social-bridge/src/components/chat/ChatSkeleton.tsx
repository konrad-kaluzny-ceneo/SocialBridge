import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ChatSkeleton() {
  return (
    <div className="flex w-full flex-col md:flex-row p-2">
      {/* left side */}
      <div className="w-full xl:w-1/3">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Twoje czaty</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "flex h-[20vh] flex-col gap-2 overflow-y-auto p-2 xl:h-[calc(100vh-200px)]",
                "scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch",
              )}
            ></div>
          </CardContent>
        </Card>
      </div>

      {/* right side */}
      <div className="relative mt-3 flex h-[59vh] w-full md:h-[88vh] md:w-2/3">
        <div className="flex h-[47vh] w-full md:h-[78vh]"></div>
        <div className="absolute bottom-0 left-0 w-full p-4"></div>
      </div>
    </div>
  );
}
