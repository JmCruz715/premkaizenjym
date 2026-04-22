import { apps } from "@/data/apps";
import { AppCard } from "@/components/AppCard";
import { Header } from "@/components/Header";
import { useUserApps } from "@/hooks/useUserApps";

const NewPage = () => {
  const { userApps } = useUserApps();
  const sorted = [...userApps, ...apps].sort((a, b) => +new Date(b.addedAt) - +new Date(a.addedAt));
  return (
    <>
      <Header title="New" subtitle="Freshly uploaded premium apps." />
      <div className="space-y-3">
        {sorted.map((a, i) => (
          <AppCard key={a.id} app={a} index={i} />
        ))}
      </div>
    </>
  );
};

export default NewPage;
