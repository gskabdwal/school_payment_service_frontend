
import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";

export function MainLayout() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[auto_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <ScrollArea className="flex-1">
          <main className="container mx-auto px-4 py-6">
            <Outlet />
          </main>
        </ScrollArea>
        <Toaster position="top-right" />
      </div>
    </div>
  )
}
