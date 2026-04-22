import { Header } from "@/components/Header";
import { ShieldCheck, Sparkles, Download, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => (
  <>
    <Header title="About" subtitle="What Kaizen Apps is — and how it works." />

    <section className="glass-strong rounded-3xl p-6 animate-fade-up space-y-4">
      <p className="text-sm text-muted-foreground leading-relaxed">
        <strong className="text-foreground">Kaizen Apps</strong> is a community-driven hub for premium Android
        applications, made freely available. Our mission is simple: great software shouldn't be locked behind
        expensive subscriptions for everyone. We curate, test and host modified APKs that unlock the premium
        features users actually want.
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { icon: Sparkles, title: "Hand-picked", text: "Every APK is selected and tested before it goes live." },
          { icon: Download, title: "One-tap install", text: "Direct MediaFire downloads — no surveys, no ads." },
          { icon: ShieldCheck, title: "Safe sources", text: "We only host versions from trusted modding teams." },
          { icon: MessageCircle, title: "Community-driven", text: "Suggest the next app to be added via Messenger." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="glass rounded-2xl p-4">
            <Icon className="w-5 h-5 text-gradient mb-2" />
            <h3 className="font-semibold text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{text}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-semibold mt-2">How it works</h3>
        <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 mt-2">
          <li>Browse the home feed or use Search to find an app.</li>
          <li>Tap the card to read full features and version details.</li>
          <li>Press <em>Get</em> — the APK opens on MediaFire for download.</li>
          <li>Allow installs from unknown sources on your device, then install.</li>
        </ol>
      </div>

      <p className="text-xs text-muted-foreground">
        Disclaimer: Kaizen Apps is an independent fan project. All trademarks belong to their respective owners.
        We do not host original copyrighted content; APKs are linked from public mirrors.
      </p>

      <Link
        to="/contact"
        className="liquid-btn liquid-btn-brand px-5 py-2.5 text-sm font-semibold text-white inline-flex items-center gap-2"
      >
        <MessageCircle className="w-4 h-4" /> Send a suggestion
      </Link>
    </section>
  </>
);

export default About;
