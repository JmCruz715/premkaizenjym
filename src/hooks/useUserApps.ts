import type { App } from "@/data/apps";

// Upload feature removed — apps are now curated statically in src/data/apps.ts
export const useUserApps = () => {
  return {
    userApps: [] as App[],
    screenshots: {} as Record<string, string[]>,
    loading: false,
  };
};
