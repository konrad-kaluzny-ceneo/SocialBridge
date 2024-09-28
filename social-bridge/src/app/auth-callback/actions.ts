"use server";

import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";

export const getUser = async () => {
  const user = await currentUser();

  if (!user?.id || !user.primaryEmailAddress?.emailAddress) {
    throw new Error("Niepoprawne dane użytkownika");
  }

  const existingUser = await db.user.findFirst({
    where: { email: user.primaryEmailAddress.emailAddress },
  });

  if (existingUser != null) {
    if (existingUser.id != user.id) {
      // debug purpose only - save existed clerk id to db
      return await db.user.update({
        where: { email: user.primaryEmailAddress.emailAddress },
        data: {
          id: user.id,
        },
      });
    }
    return existingUser;
  }

  const createdUser = await db.user.create({
    data: {
      id: user.id,
      email: user.primaryEmailAddress.emailAddress,
      image: user.imageUrl,
      name: user.fullName,
      emailVerified: new Date(),
      username: user.username,
    },
  });

  return createdUser;
};
