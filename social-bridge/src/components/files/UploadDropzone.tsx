"use client";

import { useRef, useState } from "react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import Dropzone from "react-dropzone";
import { cn } from "@/lib/utils";
import { CloudIcon, FileIcon, Loader2Icon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { trpc } from "@/server/client";
import { toast } from "sonner";

export type UploadDropzoneProps = {
  organizationId: string;
  closeDialogButtonRef: React.RefObject<HTMLButtonElement> | undefined;
};

const UploadDropzone = ({
  organizationId,
  closeDialogButtonRef,
}: UploadDropzoneProps) => {
  const [isUploading, setIsUploading] = useState<boolean>(true);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { startUpload } = useUploadThing("pdfUploader");
  const router = useRouter();

  const { mutate: startPolling } = trpc.files.getFile.useMutation({
    onSuccess: (file) => {
      if (closeDialogButtonRef) {
        closeDialogButtonRef.current?.click();
      }
    },
    retry: true,
    retryDelay: 500,
  });

  const startSimulatedProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }

        return prev + 5;
      });
    }, 500);

    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFile) => {
        setIsUploading(true);
        const progressInterval = startSimulatedProgress();

        const res = await startUpload(acceptedFile);

        if (!res) {
          return toast.error("Upload failed");
        }

        const [fileResponse] = res;

        const key = fileResponse?.key;

        if (!key) {
          return toast.error("Upload failed");
        }

        clearInterval(progressInterval);
        setUploadProgress(100);

        startPolling({ key });
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="m-4 h-64 rounded-lg border border-dashed border-gray-300"
        >
          <div className="flex h-full w-full items-center">
            <label
              htmlFor="dropzone-file"
              className={cn(
                "flex h-full w-full flex-col items-center justify-center",
                "cursor-pointer rounded-lg bg-gray-50 hover:bg-gray-100",
              )}
            >
              <div className="flex flex-col items-center py-6">
                <CloudIcon className="mb-2 h-6 w-6 text-zinc-500" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-zinc-500">PDF (up to 16MB)</p>
              </div>

              {acceptedFiles && acceptedFiles[0] ? (
                <div
                  className={cn(
                    "flex max-w-xs items-center justify-center overflow-hidden rounded-md bg-white",
                    "divide-x divide-zinc-200 outline outline-[1px] outline-zinc-200",
                  )}
                >
                  <div className="px-3 py-2">
                    <FileIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="truncate px-3 py-2 text-xs">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {isUploading ? (
                <div className="mx-auto mt-4 w-full max-w-xs">
                  <Progress
                    value={uploadProgress}
                    className="h-1 w-full bg-zinc-200"
                    indicatorColor={
                      uploadProgress === 100 ? "bg-green-500" : ""
                    }
                  />
                  {uploadProgress === 100 ? (
                    <div className="mt-4 flex items-center justify-center gap-1 text-sm text-zinc-700">
                      <Loader2Icon className="h-3 w-3 animate-spin" />
                      Redirecting...
                    </div>
                  ) : null}
                </div>
              ) : null}

              <input
                {...getInputProps()}
                id="dropzone-file"
                className="hidden"
                type="file"
              />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

type Props = {
  isSubscribed: boolean;
};

export default function UploadButton({ organizationId }: UploadDropzoneProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const closeDialogButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Dodaj plik PDF</Button>
      </DialogTrigger>

      <DialogContent>
        <UploadDropzone
          organizationId={organizationId}
          closeDialogButtonRef={closeDialogButtonRef}
        />
      </DialogContent>

      <DialogFooter className="grid grid-cols-2 gap-2">
        \
        <DialogClose asChild ref={closeDialogButtonRef}>
          <Button variant="secondary">Anuluj</Button>
        </DialogClose>
      </DialogFooter>
    </Dialog>
  );
}
