import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const middleware = async () => {
  const { userId } = auth();

  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  const organizationId = user?.organizationId;

  return { userId, organizationId };
};

const onPhotoUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
  };
}) => {
  try {
    const uploadedFile = await db.photo.create({
      data: {
        key: file.key,
        url: file.url,
        fileName: file.name,
      },
    });

    return { uploadedFile };
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const onPdfUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
  };
}) => {
  try {
    const uploadedFile = await db.file.create({
      data: {
        key: file.key,
        url: file.url,
        fileName: file.name,
        organizationId: metadata.organizationId!,
      },
    });

    return { uploadedFile };
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const ourFileRouter = {
  photoUploader: f({ image: { maxFileSize: "16MB" } })
    .middleware(middleware)
    .onUploadComplete(onPhotoUploadComplete),
  pdfUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(middleware)
    .onUploadComplete(onPdfUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
