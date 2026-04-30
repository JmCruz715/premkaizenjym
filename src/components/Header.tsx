import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { KaizenLogo } from "./KaizenLogo";

export const Header = ({
  title,
  subtitle,
  showLogo = true,
}: {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
}) => (
  <header className="mb-5 animate-fade-up flex items-start justify-between gap-3">
    <div className="flex items-start gap-3 min-w-0">
      {showLogo && (
        <Link to="/" className="tap-press shrink-0 mt-1" aria-label="Home">
          <KaizenLogo size={44} animated />
        </Link>
      )}
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
          <span className="text-gradient">{title}</span>
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
    <ThemeToggle className="shrink-0" />
  </header>
);
