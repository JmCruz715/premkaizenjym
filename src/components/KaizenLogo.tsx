import { cn } from "@/lib/utils";

/**
 * Premium iOS-style Kaizen logo.
 * A squircle with deep red→purple→blue gradient and a glossy bold "K" inside.
 * Pure CSS so it scales crisply and stays light.
 */
export const KaizenLogo = ({
  size = 40,
  className,
  animated = false,
}: {
  size?: number;
  className?: string;
  animated?: boolean;
}) => {
  return (
    <div
      className={cn(
        "kaizen-logo relative inline-flex items-center justify-center shrink-0",
        animated && "kaizen-logo-animated",
        className,
      )}
      style={{ width: size, height: size }}
      aria-label="Kaizen Apps logo"
    >
      <span
        className="kaizen-logo-k"
        style={{ fontSize: size * 0.62 }}
      >
        K
      </span>
    </div>
  );
};
