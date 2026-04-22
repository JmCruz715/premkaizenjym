import { useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { apps } from "@/data/apps";
import { AppCard } from "@/components/AppCard";
import { Header } from "@/components/Header";
import { useUserApps } from "@/hooks/useUserApps";

const SearchPage = () => {
  const [q, setQ] = useState("");
  const { userApps } = useUserApps();
  const all = useMemo(() => [...userApps, ...apps], [userApps]);
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return all;
    return all.filter(
      (a) =>
        a.name.toLowerCase().includes(t) ||
        a.tagline.toLowerCase().includes(t) ||
        a.category.toLowerCase().includes(t)
    );
  }, [q, all]);

  return (
    <>
      <Header title="Search" subtitle="Find apps by name or category." />
      <div className="glass rounded-full flex items-center gap-2 px-4 py-3 mb-5">
        <SearchIcon className="w-5 h-5 text-muted-foreground" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search Spotify, video, music..."
          className="bg-transparent outline-none flex-1 text-sm placeholder:text-muted-foreground"
        />
      </div>
      <div className="space-y-3">
        {results.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">No apps match "{q}".</p>
        ) : (
          results.map((a, i) => <AppCard key={a.id} app={a} index={i} />)
        )}
      </div>
    </>
  );
};

export default SearchPage;
