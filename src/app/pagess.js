import { redirect } from "next/navigation";

export default function RootPage() {
  // Ye server-side redirect karega foran
  redirect("/en");
}