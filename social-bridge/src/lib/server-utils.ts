import { Roles } from "@/types/globals";
import { auth, User } from "@clerk/nextjs/server";

export const checkRole = (role: Roles) => {
  const { sessionClaims } = auth();

  return sessionClaims?.metadata.role === role;
};

export const getUserEmail = (user: User | null) => {
  if (!user) return null;

  return (
    user.emailAddresses.find((e: any) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? user.emailAddresses[0].emailAddress
  );
};
