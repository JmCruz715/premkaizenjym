export const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <header className="mb-5 animate-fade-up">
    <h1 className="text-3xl sm:text-4xl font-bold">
      <span className="text-gradient">{title}</span>
    </h1>
    {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
  </header>
);
