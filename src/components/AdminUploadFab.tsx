import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const AdminUploadFab = () => {
  const { isAdmin, user } = useAuth();
  return (
    <Link
      to={user ? "/upload" : "/auth"}
      aria-label="Upload new app"
      title={isAdmin ? "Upload new app" : user ? "Admin only" : "Sign in to upload"}
      className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full bg-[image:var(--gradient-brand)] shadow-2xl flex items-center justify-center text-white tap-press hover:scale-105 active:scale-95 transition-transform ring-2 ring-white/20"
    >
      <Plus className="w-7 h-7" />
    </Link>
  );
};
