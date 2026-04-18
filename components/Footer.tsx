"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
} from "lucide-react";
import { YoutubeIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { API_SUBSCRIBERS } from "@/lib/api/endpoints";
import { getCurrentYear } from "@/lib/utils";
import { AlreadySubscribedModal } from "./AlreadySubscribedModal";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAlreadySubscribedModal, setShowAlreadySubscribedModal] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter an email");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_SUBSCRIBERS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success("Subscribed successfully!");
        setEmail("");
      } else {
        const data = await response.json();
        if (response.status === 400 && data.error === "Already subscribed with this email") {
          setShowAlreadySubscribedModal(true);
        } else {
          toast.error("Subscription failed. Please try again.");
        }
      }
    } catch (error) {
      toast.error("Error subscribing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-[#0a0a0b] text-white py-24 relative overflow-hidden border-t border-white/5">
      {/* Premium Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand section */}
          <div className="space-y-10">
            <h3 className="text-4xl font-black tracking-tighter italic text-white">
              Meridian's
            </h3>
            <p className="text-white/60 text-lg leading-relaxed font-medium">
              Empowering the next generation of leaders through excellence in
              education and character building since 2004.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: "https://www.facebook.com/p/Meridians-Group-Of-Education-100095628877699/" },
                { icon: Instagram, href: "https://www.instagram.com/meridiansgroupofeducation?fbclid=IwY2xjawQ4g5BleHRuA2FlbQIxMABicmlkETFSZDl6NFlzMjVnbkFjUVhHc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHsloEWwEW3_psm30P4ECMHbJ9O6LuHnTsUWYyv46PHJGmJ5xkym-jf1ud8eV_aem_knxBwc3v2ZC5FEgPA__n1w" },
                { icon: YoutubeIcon, href: "https://www.youtube.com/@Meridian.Academy" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white hover:-translate-y-1 transition-all duration-300 border border-white/10"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xl font-black mb-10 tracking-tight">
              Navigation
            </h4>
            <ul className="space-y-4">
              {["Home", "About", "Programs", "Blog", "Video", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-primary transition-colors text-lg font-medium flex items-center gap-3 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary group-hover:scale-150 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl font-black mb-10 tracking-tight">
              Get in Touch
            </h4>
            <ul className="space-y-6">
            
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <a
                  href="tel:03033569000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-primary font-bold"
                >
                  0303 3569000
                </a>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <a
                  href="tel:03214712207"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-primary font-bold"
                >
                  03214712207
                </a>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <a href="mailto:meridians35102@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-primary font-bold truncate"
                >
                  meridians35102@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[32px] border border-white/10">
            <h4 className="text-xl font-black mb-4 tracking-tight">
              Newsletter
            </h4>
            <p className="text-white/50 text-sm mb-8 font-medium">
              Subscribe for the latest updates in technical & holistic
              education.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-14 rounded-2xl focus:ring-primary focus:border-primary transition-all"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white h-14 rounded-2xl text-md font-black shadow-lg shadow-primary/20 transform active:scale-95 transition-all"
              >
                {isLoading ? "Wait..." : "Join Now"}
              </Button>
            </form>
          </div>

          <AlreadySubscribedModal 
            isOpen={showAlreadySubscribedModal} 
            onClose={() => setShowAlreadySubscribedModal(false)} 
          />
        </div>

        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <p className="text-white/40 text-sm font-bold">
              © {getCurrentYear()} Meridian's Group of Education. All Rights Reserved.
            </p>
            <span className="hidden md:block text-white/10">|</span>
            <p className="text-white/40 text-sm font-bold">
              Powered by{" "}
              <a
                href="https://www.globiumclouds.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-black transition-colors"
              >
                Globium Clouds
              </a>
            </p>
          </div>
          {/* <div className="flex gap-10">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-white/40 hover:text-primary text-xs font-black uppercase tracking-widest transition-colors"
              >
                {item}
              </Link>
            ))}
          </div> */}
        </div>
      </div>
    </footer>
  );
}
