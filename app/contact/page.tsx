/// Contact Page - A comprehensive contact page with maps in single row 40% width grid
"use client";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Navbar } from "@/components/Navbar";
import { PageHero } from "@/components/PageHero";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Send,
  User,
  MessageSquare,
  Share2,
  ArrowRight,
} from "lucide-react";
import { API_CONTACT } from "@/lib/api/endpoints";
import { SectionHeader } from "@/components/SectionHeader";
import { ContactCard } from "@/components/ContactCard";
import homeImage1 from "@/assets/home/home images/home-1.jpeg";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadedMaps, setLoadedMaps] = useState<Record<number, boolean>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_CONTACT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          "Message sent successfully! We will get back to you soon.",
        );
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error sending message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <PageHero
        badge="Get in Touch"
        titleMain="Connect"
        titleAccent="With Us"
        image={homeImage1}
        description="Have questions? We're here to help you on your educational journey."
      />

      {/* Contact Section */}
      <section className="py-24 relative overflow-hidden bg-background">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Column: Contact Info & Support */}
            <div className="lg:col-span-4 space-y-8">
              <AnimatedSection direction="left">
                <div className="mb-10">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    Contact Us
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight mb-6">
                    Let's Start a <br />
                    <span className="text-primary italic font-serif">
                      Conversation
                    </span>
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Whether you're a prospective parent, a current student, or
                    an alum, we're always here to listen and help.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      icon: Phone,
                      title: "Call Us",
                      content: "0303 3569000",
                      sub: "Mon-Sat, 9am - 5pm",
                      link: "tel:03033569000",
                    },
                    {
                      icon: Mail,
                      title: "Email Us",
                      content: "meridians35102@gmail.com",
                      sub: "We reply within 24hrs",
                      link: "mailto:meridians35102@gmail.com",
                    },
                  ].map((item, idx) => (
                    <a
                      key={idx}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex gap-5 p-5 rounded-[24px] bg-card border border-primary/10 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <item.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1 group-hover:text-primary transition-colors">
                          {item.title}
                        </p>
                        <p className="text-lg font-black text-foreground leading-none mb-1">
                          {item.content}
                        </p>
                        <p className="text-sm text-primary font-medium opacity-70 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          {item.sub} <ArrowRight className="w-3 h-3" />
                        </p>
                      </div>
                    </a>
                  ))}
                </div>

                <div className="mt-12 p-8 rounded-[32px] bg-slate-900 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4 text-secondary">
                      <Clock className="w-5 h-5" />
                      <span className="text-xs font-black uppercase tracking-widest">
                        Office Hours
                      </span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-sm font-medium text-white/60">
                          Monday - Friday
                        </span>
                        <span className="text-sm font-bold text-white">
                          9:00 AM - 5:30 PM
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-sm font-medium text-white/60">
                          Saturday
                        </span>
                        <span className="text-sm font-bold text-white">
                          10:00 AM - 2:00 PM
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-white/60">
                          Sunday
                        </span>
                        <span className="text-sm font-bold text-destructive">
                          Closed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-8">
              <AnimatedSection direction="right">
                <div className="relative p-1 rounded-[40px] bg-gradient-to-br from-primary/30 via-transparent to-secondary/30">
                  <div className="bg-card rounded-[39px] p-8 md:p-12 shadow-2xl shadow-primary/5">
                    <div className="mb-10 text-center md:text-left">
                      <h3 className="text-3xl font-black text-foreground mb-4 tracking-tight">
                        Send us a{" "}
                        <span className="text-primary italic font-serif">
                          Message
                        </span>
                      </h3>
                      <p className="text-muted-foreground">
                        Have a specific inquiry? Fill out the form below and our
                        team will get back to you promptly.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label
                            htmlFor="name"
                            className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                          >
                            Full Name
                          </Label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                              <User className="w-5 h-5" />
                            </div>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="e.g. John Doe"
                              required
                              className="pl-12 h-14 rounded-2xl border-primary/10 bg-primary/5 focus:bg-white transition-all focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label
                            htmlFor="email"
                            className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                          >
                            Email Address
                          </Label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                              <Mail className="w-5 h-5" />
                            </div>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="john@example.com"
                              required
                              className="pl-12 h-14 rounded-2xl border-primary/10 bg-primary/5 focus:bg-white transition-all focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="message"
                          className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                        >
                          Your Message
                        </Label>
                        <div className="relative group">
                          <div className="absolute left-4 top-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                            <MessageSquare className="w-5 h-5" />
                          </div>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="How can we help you today?"
                            rows={6}
                            required
                            className="pl-12 pt-4 rounded-[24px] border-primary/10 bg-primary/5 focus:bg-white transition-all focus:ring-2 focus:ring-primary/20 min-h-[160px]"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-center gap-6 pt-4">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full md:w-auto min-w-[200px] h-16 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 group hover:scale-[1.02] transition-all duration-300"
                        >
                          {isLoading ? (
                            "Sending..."
                          ) : (
                            <span className="flex items-center gap-2">
                              Send Message{" "}
                              <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </span>
                          )}
                        </Button>
                        <p className="text-xs text-muted-foreground italic max-w-[240px] text-center md:text-left leading-relaxed">
                          By submitting this form, you agree to our privacy
                          policy and terms of service.
                        </p>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Social Connect Bar */}
                <div className="mt-8 flex flex-col md:flex-row items-center justify-between p-8 rounded-[32px] bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-4 mb-6 md:mb-0">
                    <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                      <Share2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black tracking-tight">
                        Stay Connected
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Follow our daily journey on social media.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {[
                      {
                        icon: Facebook,
                        color: "hover:bg-[#1877F2]",
                        link: "https://www.facebook.com/p/Meridians-Group-Of-Education-100095628877699/",
                      },
                      {
                        icon: Instagram,
                        color:
                          "hover:bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
                        link: "https://www.instagram.com/meridiansgroupofeducation?fbclid=IwY2xjawQ4g5BleHRuA2FlbQIxMABicmlkETFSZDl6NFlzMjVnbkFjUVhHc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHsloEWwEW3_psm30P4ECMHbJ9O6LuHnTsUWYyv46PHJGmJ5xkym-jf1ud8eV_aem_knxBwc3v2ZC5FEgPA__n1w",
                      },
                      // { icon: Twitter, color: "hover:bg-[#1DA1F2]", link: "#" },
                      // {
                      //   icon: Linkedin,
                      //   color: "hover:bg-[#0077B5]",
                      //   link: "#",
                      // },
                      // { icon: Youtube, color: "hover:bg-[#FF0000]", link: "#" },
                    ].map((Social, idx) => (
                      <a
                        key={idx}
                        href={Social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 rounded-xl bg-white border border-primary/10 flex items-center justify-center text-muted-foreground hover:text-white ${Social.color} shadow-sm transition-all duration-300 transform hover:-translate-y-1`}
                      >
                        <Social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>


              </AnimatedSection>

            </div>
          </div>
          {/* Maps - 90% laptop width, no grid */}
          <div className="w-full mt-10 border border-primary/10 rounded-3xl overflow-hidden shadow-xl shadow-primary/5 bg-card flex flex-col">
            {[
              {
                title: "Boys Campus Map",
                src: "https://maps.google.com/maps?q=31.4837883,74.4195471&z=17&output=embed",
                googleUrl: "https://maps.google.com/maps?q=31.4837883,74.4195471&z=17",
                contacts: ["03214712207", "03033569000"],
              },
              {
                title: "Campus II Map",
                address: "Amjad Colony, Tatla Road, Heir Bedian Road, Lahore",
                contacts: ["03044641590", "03034027152"],
                src: "https://maps.google.com/maps?q=31.4849921,74.4181172&z=17&output=embed",
                googleUrl: "https://maps.google.com/maps?q=31.4849921,74.4181172&z=17",
              },
              {
                title: "Campus III Map",
                address: "Alfalah Town, near Toheed Mart, Main Bedian Road, Lahore",
                contacts: ["03214712207", "03044230664"],
                src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.477221151887!2d74.41746457430202!3d31.483564048961952!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190f10d82ef259%3A0xc8950709f77ff8d0!2sTauheed%20Store!5e0!3m2!1sen!2s!4v1775135276995!5m2!1sen!2s",
                googleUrl: "https://maps.app.goo.gl/CtDWuJqEo1aXbPTN9",
              },

            ].map((mapItem, idx) => (
              <div
                key={idx}
                className={`w-full ${idx === 0 ? "border-b border-primary/15" : ""}`}
              >
                <div className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/5 border-b border-primary/20">
                  <p className="text-sm font-black uppercase tracking-wider text-foreground">
                    {mapItem.title}
                  </p>
                  {"address" in mapItem && mapItem.address ? (
                    <p className="text-xs text-muted-foreground mt-1">
                      {mapItem.address}
                    </p>
                  ) : null}
                  {"contacts" in mapItem && mapItem.contacts?.length ? (
                    <p className="text-xs text-muted-foreground mt-1">
                      Contact: {mapItem.contacts.join(" , ")}
                    </p>
                  ) : null}
                </div>
                <div className="relative h-[300px]">
                  {!loadedMaps[idx] && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm">
                      <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                        Loading map...
                      </p>
                    </div>
                  )}
                  <iframe
                    title={mapItem.title}
                    src={mapItem.src}
                    className="w-full h-full cursor-pointer hover:opacity-90 transition-opacity duration-200"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    onLoad={() =>
                      setLoadedMaps((prev) => ({
                        ...prev,
                        [idx]: true,
                      }))
                    }
                    onClick={() => window.open(mapItem.googleUrl, "_blank")}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
