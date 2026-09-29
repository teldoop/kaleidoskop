import Sidebar from "@/components/sidebar";
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 p-5 pb-24 md:p-10">{children}</main>
    </div>
  );
}
