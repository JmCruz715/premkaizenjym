import { useState } from "react";
import { createPortal } from "react-dom";
import { Copy, Check, Heart, X } from "lucide-react";
import { GCASH_NUMBER, GCASH_NAME, DONATION_URL } from "@/data/donation";

export const DonateButton = ({
  className = "",
  label = "Donate",
  variant = "ghost",
}: {
  className?: string;
  label?: string;
  variant?: "ghost" | "brand";
}) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(GCASH_NUMBER.replace(/\s/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label="Donate via GCash"
        className={`liquid-btn tap-press ${
          variant === "brand" ? "liquid-btn-brand" : ""
        } inline-flex items-center justify-center gap-1.5 text-white ${className}`}
      >
        <Heart className="w-3.5 h-3.5 fill-[hsl(350_90%_60%)] text-[hsl(350_90%_60%)]" />
        {label}
      </button>

      {open && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-up"
          onClick={() => setOpen(false)}
        >
          <div
            className="glass-strong rounded-3xl p-6 w-full max-w-sm relative animate-pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center tap-press"
            >
              <X className="w-4 h-4 text-foreground" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[image:var(--gradient-brand)] flex items-center justify-center mb-3 animate-pop-in">
                <Heart className="w-7 h-7 text-white fill-white" />
              </div>
              <h3 className="text-xl font-bold">Support Kaizen</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-[14rem]">
                Send your donation via GCash to keep premium apps free for everyone.
              </p>

              <div className="glass rounded-2xl w-full mt-5 p-4">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">GCash number</p>
                <p className="text-2xl font-bold text-gradient mt-1 tracking-wide">{GCASH_NUMBER}</p>
                <p className="text-xs text-muted-foreground mt-1">Account name: {GCASH_NAME}</p>
              </div>

              <div className="flex gap-2 w-full mt-4">
                <button
                  type="button"
                  onClick={copy}
                  className="liquid-btn liquid-btn-brand tap-press flex-1 px-4 py-2.5 text-sm font-semibold text-white inline-flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy number
                    </>
                  )}
                </button>
                <a
                  href={DONATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="liquid-btn tap-press px-4 py-2.5 text-sm font-semibold text-white inline-flex items-center justify-center gap-2"
                >
                  Message
                </a>
              </div>

              <p className="text-[10px] text-muted-foreground mt-4">Thank you for supporting the project ❤️</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
