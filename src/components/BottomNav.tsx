import { Home, Search, Sparkles, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/search", label: "Search", icon: Search },
  { to: "/new", label: "New", icon: Sparkles },
  { to: "/profile", label: "Profile", icon: User },
];

export const BottomNav = () => {
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(92%,28rem)]"
    >
      <div className="glass-strong rounded-full px-2 py-2 flex items-center justify-between">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end as boolean | undefined}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-full text-[10px] font-medium transition-all duration-300 tap-press ${
                isActive
                  ? "liquid-btn liquid-btn-brand text-white scale-105"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isActive ? "scale-110" : ""
                  }`}
                />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
