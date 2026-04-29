import { ThemeToggle } from "./ThemeToggle";

export const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <header className="mb-5 animate-fade-up flex items-start justify-between gap-3">
    <div className="min-w-0">
      <h1 className="text-3xl sm:text-4xl font-bold">
        <span className="text-gradient">{title}</span>
      </h1>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
    <ThemeToggle className="shrink-0" />
  </header>
);
