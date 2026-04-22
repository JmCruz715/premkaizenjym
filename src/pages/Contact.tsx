import { useState } from "react";
import { Header } from "@/components/Header";
import { Send, Facebook, MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    const text = encodeURIComponent(`Hi Kaizen!\n\nFrom: ${name || "Anonymous"}\n\n${msg}`);
    window.open(`https://m.me/jm.born67?text=${text}`, "_blank");
    toast({ title: "Opening Messenger…", description: "Your message is ready to send to Kaizen." });
    setMsg("");
    setName("");
  };

  return (
    <>
      <Header title="Contact" subtitle="Suggestions, feedback, or app requests." />

      <section className="glass-strong rounded-3xl p-6 animate-fade-up">
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground" htmlFor="name">
              Your name (optional)
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex"
              className="mt-1 w-full glass rounded-xl px-4 py-3 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground" htmlFor="msg">
              Message
            </label>
            <textarea
              id="msg"
              required
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              rows={5}
              placeholder="What app should we add next?"
              className="mt-1 w-full glass rounded-xl px-4 py-3 text-sm bg-transparent outline-none placeholder:text-muted-foreground resize-none"
            />
          </div>
          <button
            type="submit"
            className="liquid-btn liquid-btn-brand w-full px-5 py-3 text-sm font-semibold text-white inline-flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Send via Messenger
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-white/10 flex flex-wrap gap-2 justify-center">
          <a
            href="https://m.me/jm.born67"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-btn px-4 py-2 text-sm font-semibold text-white inline-flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" /> Open Messenger
          </a>
          <a
            href="https://www.facebook.com/jm.born67"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-btn px-4 py-2 text-sm font-semibold text-white inline-flex items-center gap-2"
          >
            <Facebook className="w-4 h-4" /> Facebook
          </a>
        </div>
      </section>
    </>
  );
};

export default Contact;
