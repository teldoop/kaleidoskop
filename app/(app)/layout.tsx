import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { currentUser, getProdi } from "@/lib/supabase";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (user && !(await getProdi(user.id))) redirect("/pilih-prodi"); // belum punya prodi
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 p-5 pb-24 md:p-10">{children}</main>
    </div>
  );
}
