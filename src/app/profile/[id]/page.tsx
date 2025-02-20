import { getCurrentUser, getUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const id: number = (await params).id;
  const user = await getUser();

  if (id == user?.id) {
    redirect("/profile");
  } else {
    console.log("id", id, "userId", user.id);
  }
  
  return <div>Profile of {id}</div>
}