import LandingPage from "@/components/LandingPage";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();

  // if (user?.id) {
  //   return redirect("/dashboard");
  // }

  return (
    <div className="m-auto flex flex-col">
      <LandingPage shouldShowLoginButton={user?.id == undefined} />
    </div>
  );
}
