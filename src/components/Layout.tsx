import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";

export const Layout = () => (
  <div className="relative min-h-screen pb-28">
    {/* floating ambient blobs */}
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full bg-[hsl(350_90%_55%/0.25)] blur-3xl animate-blob" />
      <div className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] rounded-full bg-[hsl(220_95%_55%/0.25)] blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
      <div className="absolute bottom-0 left-1/3 w-[30rem] h-[30rem] rounded-full bg-[hsl(280_90%_55%/0.30)] blur-3xl animate-blob" style={{ animationDelay: "6s" }} />
    </div>
    <main className="max-w-2xl mx-auto px-4 pt-6">
      <Outlet />
    </main>
    <BottomNav />
  </div>
);
