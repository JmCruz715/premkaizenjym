import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { toast } from "sonner";

const Auth = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav("/new");
    });
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Signed in");
      nav("/upload");
    } catch (err: any) {
      toast.error(err.message || "Sign in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Header title="Admin Sign In" subtitle="Restricted to site admins only." />
      <form onSubmit={submit} className="glass-strong rounded-3xl p-5 space-y-3 animate-fade-up">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full bg-background/40 rounded-xl px-4 py-3 text-sm border border-white/10 outline-none focus:border-white/30"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full bg-background/40 rounded-xl px-4 py-3 text-sm border border-white/10 outline-none focus:border-white/30"
        />
        <button
          type="submit"
          disabled={busy}
          className="liquid-btn liquid-btn-brand tap-press w-full px-4 py-3 text-sm font-semibold text-white"
        >
          {busy ? "Please wait…" : "Sign In"}
        </button>
        <p className="text-[11px] text-muted-foreground text-center pt-2">
          Sign-up is closed. Only the site owner can sign in here.
        </p>
      </form>
    </>
  );
};

export default Auth;

  return (
    <>
      <Header title={mode === "signin" ? "Admin Sign In" : "Create Account"} subtitle="Restricted to site admins." />
      <form onSubmit={submit} className="glass-strong rounded-3xl p-5 space-y-3 animate-fade-up">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full bg-background/40 rounded-xl px-4 py-3 text-sm border border-white/10 outline-none focus:border-white/30"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full bg-background/40 rounded-xl px-4 py-3 text-sm border border-white/10 outline-none focus:border-white/30"
        />
        <button
          type="submit"
          disabled={busy}
          className="liquid-btn liquid-btn-brand tap-press w-full px-4 py-3 text-sm font-semibold text-white"
        >
          {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Sign Up"}
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full text-xs text-muted-foreground hover:text-foreground transition"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
        <p className="text-[11px] text-muted-foreground text-center pt-2">
          After signing up, an existing admin must grant you the <code>admin</code> role in the database.
        </p>
      </form>
    </>
  );
};

export default Auth;
