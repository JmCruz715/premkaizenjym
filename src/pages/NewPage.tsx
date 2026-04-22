import { apps } from "@/data/apps";
import { AppCard } from "@/components/AppCard";
import { Header } from "@/components/Header";

const NewPage = () => {
  const sorted = [...apps].sort((a, b) => +new Date(b.addedAt) - +new Date(a.addedAt));
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
