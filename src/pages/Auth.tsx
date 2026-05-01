import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Header } from "@/components/Header";
import { toast } from "sonner";

const Auth = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav("/admin");
    });
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Signed in");
      nav("/admin");
    } catch (err: any) {
      toast.error(err.message || "Sign in failed");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/admin",
      });
      if (result.error) throw new Error((result.error as any).message || "Google sign in failed");
      if (result.redirected) return;
      toast.success("Signed in with Google");
      nav("/admin");
    } catch (err: any) {
      toast.error(err.message || "Google sign in failed");
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

        <div className="flex items-center gap-3 py-1">
          <span className="flex-1 h-px bg-white/15" />
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">or</span>
          <span className="flex-1 h-px bg-white/15" />
        </div>

        <button
          type="button"
          onClick={google}
          disabled={busy}
          className="liquid-btn tap-press w-full px-4 py-3 text-sm font-semibold text-white inline-flex items-center justify-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#fff" d="M21.35 11.1H12v3.18h5.39c-.24 1.39-1.7 4.06-5.39 4.06-3.24 0-5.88-2.68-5.88-6s2.64-6 5.88-6c1.84 0 3.08.78 3.79 1.46l2.58-2.49C16.74 3.84 14.55 3 12 3 6.98 3 3 7 3 12s3.98 9 9 9c5.2 0 8.65-3.66 8.65-8.81 0-.59-.07-1.04-.16-1.49z"/></svg>
          Continue with Google
        </button>

        <p className="text-[11px] text-muted-foreground text-center pt-2">
          Sign-up is closed. Only the site owner can sign in here.
        </p>
      </form>
    </>
  );
};

export default Auth;
