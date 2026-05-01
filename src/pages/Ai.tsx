import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Sparkles, Send, Image as ImageIcon, Loader2, Bot, User as UserIcon, Download } from "lucide-react";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string; image?: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kaizen-chat`;

const Ai = () => {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hello! I'm **KaizenGPT** — ask me anything, or switch to image mode to generate photos. 🎨" },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"chat" | "image">("chat");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 9e9, behavior: "smooth" });
  }, [messages, busy]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const userMsg: Msg = { role: "user", content: text };
    setMessages((p) => [...p, userMsg]);
    setBusy(true);
    try {
      if (mode === "image") {
        const res = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ imagePrompt: text }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        setMessages((p) => [...p, { role: "assistant", content: `Generated for: *${text}*`, image: data.image }]);
      } else {
        const res = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: [...messages.filter(m => !m.image).map(({ role, content }) => ({ role, content })), userMsg] }),
        });
        if (!res.ok || !res.body) {
          const t = await res.text();
          throw new Error(t || "Stream failed");
        }
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let buf = "";
        let acc = "";
        setMessages((p) => [...p, { role: "assistant", content: "" }]);
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          let i: number;
          while ((i = buf.indexOf("\n")) !== -1) {
            let line = buf.slice(0, i);
            buf = buf.slice(i + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (!line.startsWith("data: ")) continue;
            const j = line.slice(6).trim();
            if (j === "[DONE]") break;
            try {
              const parsed = JSON.parse(j);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                acc += delta;
                setMessages((p) => p.map((m, idx) => (idx === p.length - 1 ? { ...m, content: acc } : m)));
              }
            } catch { buf = line + "\n" + buf; break; }
          }
        }
      }
    } catch (e: any) {
      toast.error(e.message || "Failed");
      setMessages((p) => [...p, { role: "assistant", content: `⚠️ ${e.message || "Error"}` }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Header title="KaizenGPT" subtitle="Q&A · image generator · powered by GPT-5 + Gemini" />

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setMode("chat")}
          className={`flex-1 tap-press inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold ${mode === "chat" ? "liquid-btn liquid-btn-brand text-white" : "glass text-muted-foreground"}`}
        >
          <Sparkles className="w-3.5 h-3.5" /> Chat (Q&A)
        </button>
        <button
          onClick={() => setMode("image")}
          className={`flex-1 tap-press inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold ${mode === "image" ? "liquid-btn liquid-btn-brand text-white" : "glass text-muted-foreground"}`}
        >
          <ImageIcon className="w-3.5 h-3.5" /> Image gen
        </button>
      </div>

      <div ref={scroller} className="glass-strong rounded-3xl p-3 sm:p-4 h-[60vh] overflow-y-auto space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-gradient-to-br from-fuchsia-500 to-blue-500" : "bg-gradient-to-br from-emerald-500 to-teal-500"}`}>
              {m.role === "user" ? <UserIcon className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-white" />}
            </span>
            <div className={`glass rounded-2xl px-3 py-2 text-sm max-w-[85%] whitespace-pre-wrap break-words ${m.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"}`}>
              {m.content}
              {m.image && (
                <div className="mt-2">
                  <img src={m.image} alt="Generated" className="rounded-xl w-full" />
                  <a
                    href={m.image}
                    download="kaizen-ai.png"
                    className="liquid-btn tap-press mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-white"
                  >
                    <Download className="w-3 h-3" /> Save
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex gap-2">
            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
            </span>
            <div className="glass rounded-2xl px-3 py-2 text-sm text-muted-foreground">Thinking…</div>
          </div>
        )}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "image" ? "Describe an image…" : "Ask me anything…"}
          className="flex-1 bg-background/50 glass rounded-full px-4 py-3 text-sm outline-none border border-white/15 focus:border-white/40"
          disabled={busy}
        />
        <button type="submit" disabled={busy || !input.trim()} className="liquid-btn liquid-btn-brand tap-press w-12 h-12 inline-flex items-center justify-center text-white shrink-0 disabled:opacity-50">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </>
  );
};

export default Ai;
