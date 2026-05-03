import { useEffect, useRef, useState } from "react";
import { Bot, Send, Loader2, User as UserIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

/**
 * Admin-only AI assistant. Calls the `admin-ai` edge function which has
 * tool-calling powers to create / edit / delete apps and update the
 * admin profile. Lives inside the Admin page.
 */
export const AdminAiChat = ({ onAfterAction }: { onAfterAction?: () => void }) => {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Kumusta admin! Kaya kong mag-add/edit/delete ng apps, panatilihin ang MediaFire links, palitan profile/badge, at i-adjust ang mobile layout range/card size. Hal: 'gawing compact pang-phone ang layout'." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 9e9, behavior: "smooth" });
  }, [messages, busy]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-ai", {
        body: { messages: next.map(({ role, content }) => ({ role, content })) },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setMessages((p) => [...p, { role: "assistant", content: data?.reply || "Done." }]);
      onAfterAction?.();
    } catch (e: any) {
      toast.error(e.message || "Failed");
      setMessages((p) => [...p, { role: "assistant", content: `⚠️ ${e.message || "Error"}` }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="glass-strong rounded-3xl p-3 sm:p-4">
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </span>
        <div>
          <h3 className="text-sm font-bold">Lovable Admin AI</h3>
          <p className="text-[10px] text-muted-foreground">Apps, profile, MediaFire links, at mobile layout</p>
        </div>
      </div>

      <div ref={scroller} className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-gradient-to-br from-fuchsia-500 to-blue-500" : "bg-gradient-to-br from-emerald-500 to-teal-500"}`}>
              {m.role === "user" ? <UserIcon className="w-3 h-3 text-white" /> : <Bot className="w-3 h-3 text-white" />}
            </span>
            <div className={`glass rounded-2xl px-3 py-2 text-xs max-w-[85%] whitespace-pre-wrap break-words ${m.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"}`}>
              {m.content}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex gap-2">
            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Loader2 className="w-3 h-3 text-white animate-spin" />
            </span>
            <div className="glass rounded-2xl px-3 py-2 text-xs text-muted-foreground">Working…</div>
          </div>
        )}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Sabihin mo kung ano gagawin…"
          className="flex-1 bg-background/50 rounded-full px-3 py-2 text-xs outline-none border border-white/15 focus:border-white/40"
          disabled={busy}
        />
        <button type="submit" disabled={busy || !input.trim()} className="liquid-btn liquid-btn-brand tap-press w-10 h-10 inline-flex items-center justify-center text-white shrink-0 disabled:opacity-50">
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
