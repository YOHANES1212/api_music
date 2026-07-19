import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import PlayerBar from "@/components/PlayerBar";
import { PlayerProvider } from "@/lib/player-context";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <PlayerProvider>
      <div className="flex min-h-screen flex-1 flex-col bg-black">
        <div className="flex flex-1">
          <Sidebar />
          <main className="min-w-0 flex-1 bg-gradient-to-b from-zinc-900 to-black p-4 pb-6 sm:p-6">
            {children}
          </main>
        </div>
        <div className="sticky bottom-0 z-10">
          <PlayerBar />
          <MobileNav />
        </div>
      </div>
    </PlayerProvider>
  );
}
