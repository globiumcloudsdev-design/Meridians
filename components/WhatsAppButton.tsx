"use client";

import { useState, useRef, useEffect } from "react";
import { X, MessageCircle, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
// WhatsApp number in international format (e.g., 923033569000)
const RAW_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "03033569000";
const cleanDigits = RAW_WHATSAPP_NUMBER.replace(/\D/g, "");
const WHATSAPP_NUMBER = cleanDigits.startsWith("0")
  ? `92${cleanDigits.slice(1)}`
  : cleanDigits;
// ──────────────────────────────────────────────────────────────────────────────

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus textarea when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  function handleSend() {
    const trimmed = message.trim();
    if (!trimmed) return;
    const encoded = encodeURIComponent(trimmed);
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`,
      "_blank",
      "noopener,noreferrer"
    );
    setMessage("");
    setIsOpen(false);
  }

  return (
    <>
      {/* ── Floating Button ─────────────────────────────────────────────── */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open WhatsApp chat"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 flex items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/60"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span
              key="whatsapp"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
            >
              {/* WhatsApp SVG icon */}
              <svg
                viewBox="0 0 32 32"
                fill="currentColor"
                className="w-7 h-7"
                aria-hidden="true"
              >
                <path d="M16.003 2C8.28 2 2 8.28 2 16.003c0 2.478.648 4.806 1.783 6.822L2 30l7.38-1.762A13.93 13.93 0 0 0 16.003 30C23.72 30 30 23.72 30 16.003 30 8.28 23.72 2 16.003 2zm0 25.386a11.332 11.332 0 0 1-5.784-1.583l-.415-.247-4.38 1.046 1.075-4.27-.27-.438A11.337 11.337 0 0 1 4.614 16c0-6.285 5.104-11.386 11.389-11.386S27.386 9.715 27.386 16c0 6.285-5.104 11.386-11.383 11.386zm6.238-8.52c-.342-.172-2.025-1-2.342-1.114-.316-.114-.546-.172-.776.172-.23.344-.89 1.114-1.09 1.344-.2.228-.4.257-.742.085-.342-.172-1.444-.532-2.751-1.697-1.017-.908-1.703-2.028-1.904-2.372-.2-.344-.021-.53.15-.702.155-.154.342-.402.514-.603.171-.2.228-.344.342-.573.114-.228.057-.43-.028-.602-.086-.172-.776-1.873-1.063-2.563-.28-.673-.565-.581-.776-.592l-.66-.011c-.23 0-.602.086-.917.43-.315.344-1.203 1.175-1.203 2.866s1.231 3.323 1.403 3.552c.172.228 2.422 3.7 5.87 5.19.821.354 1.461.566 1.961.724.824.262 1.574.225 2.167.137.66-.099 2.025-.827 2.312-1.627.286-.8.286-1.486.2-1.628-.086-.143-.315-.228-.657-.4z" />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Modal ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={modalRef}
            key="whatsapp-modal"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-24 right-6 z-50 w-80 rounded-3xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/20 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 bg-[#25D366]">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm leading-tight">
                  Send us a message
                </p>
                <p className="text-white/80 text-xs">Meridian&apos;s Group of Education</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close WhatsApp modal"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Chat bubble */}
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-[#25D366]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-foreground leading-relaxed max-w-[85%]">
                  👋 Hi there! How can we help you today? Type your message below.
                </div>
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSend();
                }}
                placeholder="Type your message here…"
                rows={3}
                className="w-full resize-none rounded-2xl border border-border/60 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-[#25D366]/40 focus:border-[#25D366]/60 transition-[color,box-shadow]"
              />

              <p className="text-xs text-muted-foreground text-right -mt-1">
                Ctrl+Enter to send
              </p>

              {/* Send Button */}
              <Button
                onClick={handleSend}
                disabled={!message.trim()}
                className="w-full h-12 rounded-2xl bg-[#25D366] hover:bg-[#22c55e] text-white font-bold text-sm gap-2 shadow-md shadow-[#25D366]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4" />
                Send to WhatsApp
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

