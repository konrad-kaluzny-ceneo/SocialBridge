'use client'

import { trpc } from "@/server/client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";

type Props = {
  organizationId: string;
};

export default function OrganizationFiles({ organizationId }: Props) {
  const {
    data: files,
    isLoading,
    isError,
  } = trpc.files.getFilesByOrganizationId.useQuery({
    organizationId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pliki organizacji</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center">
            <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pliki organizacji</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Wystąpił błąd podczas ładowania plików.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (files.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pliki organizacji</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Brak plików do wyświetlenia.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pliki organizacji</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {files.map((file) => (
            <li key={file.id}>
              <Link
                href={file.url}
                className="flex items-center space-x-2 text-sm hover:underline"
              >
                <FileIcon className="h-4 w-4 text-primary" />
                <span>{file.fileName}</span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
