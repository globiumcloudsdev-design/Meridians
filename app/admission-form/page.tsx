"use client";
import { AnimatedSection } from "@/components/AnimatedSection";

import { Navbar } from "@/components/Navbar";
import { PageHero } from "@/components/PageHero";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import {
  FileText,
  ArrowRight,
  ClipboardCheck,
  Users,
  Phone,
} from "lucide-react";
import { API_ADMISSION } from "@/lib/api/endpoints";

const PROGRAMS = [
  "Primary (Classes 1-5)",
  "Secondary (Classes 6-8)",
  "Senior Secondary (Classes 9-12)",
];

export default function AdmissionForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    program: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProgramChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      program: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.program
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_ADMISSION, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          "Application submitted successfully! We will contact you soon.",
        );
        setFormData({
          name: "",
          email: "",
          phone: "",
          program: "",
          message: "",
        });
      } else {
        toast.error("Failed to submit application. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting application. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <PageHero
        badge="Admission Portal"
        titleMain="Apply"
        titleAccent="Now"
        image="https://images.unsplash.com/photo-1510531704581-5b2870972060?auto=format&fit=crop&w=1920&q=80"
        description="Begin your child's journey towards excellence. Fill out the application form below to get started."
      />

      <section className="py-24 bg-background relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left Column: Form */}
            <div className="lg:col-span-7">
              <AnimatedSection direction="left">
                <div className="relative p-1 rounded-[40px] bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 shadow-2xl">
                  <Card className="border-none rounded-[39px] bg-card/80 backdrop-blur-xl overflow-hidden">
                    <CardHeader className="p-8 md:p-12 pb-4">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-3xl font-black tracking-tight">
                            Application Form
                          </CardTitle>
                          <p className="text-muted-foreground mt-1 font-medium">
                            Join the Meridian's legacy today.
                          </p>
                        </div>
                      </div>
                      <div className="h-[1px] w-full bg-gradient-to-r from-primary/10 via-primary/20 to-transparent" />
                    </CardHeader>

                    <CardContent className="p-8 md:p-12 pt-4">
                      <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Full Name */}
                          <div className="space-y-2.5">
                            <Label
                              htmlFor="name"
                              className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                            >
                              Student's Full Name{" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Enter full name"
                              required
                              className="h-14 rounded-2xl border-primary/10 bg-primary/5 focus:bg-white transition-all focus:ring-2 focus:ring-primary/20"
                            />
                          </div>

                          {/* Email */}
                          <div className="space-y-2.5">
                            <Label
                              htmlFor="email"
                              className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                            >
                              Email Address{" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="parent@email.com"
                              required
                              className="h-14 rounded-2xl border-primary/10 bg-primary/5 focus:bg-white transition-all focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Phone */}
                          <div className="space-y-2.5">
                            <Label
                              htmlFor="phone"
                              className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                            >
                              Phone Number{" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="+92-XXXXXXXXXX"
                              required
                              className="h-14 rounded-2xl border-primary/10 bg-primary/5 focus:bg-white transition-all focus:ring-2 focus:ring-primary/20"
                            />
                          </div>

                          {/* Program Selection */}
                          <div className="space-y-2.5">
                            <Label
                              htmlFor="program"
                              className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                            >
                              Target Program{" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Select
                              value={formData.program}
                              onValueChange={handleProgramChange}
                            >
                              <SelectTrigger className="h-14 rounded-2xl border-primary/10 bg-primary/5 focus:bg-white transition-all">
                                <SelectValue placeholder="Select a program" />
                              </SelectTrigger>
                              <SelectContent className="rounded-2xl border-primary/10">
                                {PROGRAMS.map((program) => (
                                  <SelectItem
                                    key={program}
                                    value={program}
                                    className="rounded-xl my-1 focus:bg-primary/5 focus:text-primary transition-colors"
                                  >
                                    {program}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-2.5">
                          <Label
                            htmlFor="message"
                            className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                          >
                            Additional Information
                          </Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Tell us about the student's interests, previous academic history, or any special requirements..."
                            rows={5}
                            className="rounded-[24px] border-primary/10 bg-primary/5 focus:bg-white transition-all focus:ring-2 focus:ring-primary/20 min-h-[150px]"
                          />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                          <Button
                            type="submit"
                            disabled={isLoading}
                            size="xl"
                            className="w-full bg-primary hover:bg-primary/95 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 group hover:scale-[1.01] transition-all py-8"
                          >
                            {isLoading ? (
                              <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Submitting...
                              </div>
                            ) : (
                              <span className="flex items-center gap-2">
                                Submit Application{" "}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                              </span>
                            )}
                          </Button>
                        </div>

                        <p className="text-[11px] text-muted-foreground text-center font-medium max-w-lg mx-auto leading-relaxed">
                          By clicking submit, you agree to our terms of
                          enrollment. Our admissions office will process your
                          data securely and contact you within 48 hours.
                        </p>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </AnimatedSection>
            </div>

            {/* Right Column: Info Cards */}
            <div className="lg:col-span-5 space-y-8">
              <AnimatedSection direction="right">
                <div className="mb-10">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    Student Portal
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight mb-6">
                    Start Your <br />
                    <span className="text-primary italic font-serif">
                      Journey
                    </span>{" "}
                    Here
                  </h2>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    We've simplified our admission process to ensure a
                    stress-free experience for parents and students alike.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      title: "Quick Review",
                      content:
                        "Our team reviews every application individually to ensure it matches our academic standards.",
                      icon: ClipboardCheck,
                      color: "primary",
                    },
                    {
                      title: "Document Support",
                      content:
                        "Need help with certificates? Our helpdesk is available 24/7 to guide you through the paperwork.",
                      icon: FileText,
                      color: "secondary",
                    },
                    {
                      title: "Campus Visit",
                      content:
                        "After form submission, we'll schedule a personalized campus tour for you and your child.",
                      icon: Users,
                      color: "info",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="group flex gap-6 p-6 rounded-[32px] bg-card border border-primary/5 hover:border-primary/20 hover:shadow-2xl transition-all duration-500"
                    >
                      <div
                        className={`w-14 h-14 rounded-2xl bg-${item.color}/10 flex items-center justify-center shrink-0 group-hover:bg-${item.color} group-hover:text-white transition-all duration-300`}
                      >
                        <item.icon className="w-6 h-6 text-primary group-hover:text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black mb-1 group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Support Box */}
                <div className="mt-12 p-10 rounded-[40px] bg-slate-900 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
                  <div className="relative z-10">
                    <h4 className="text-2xl font-black mb-4">
                      Need Immediate Help?
                    </h4>
                    <p className="text-white/60 mb-8 text-sm leading-relaxed">
                      Our admission counselors are just a call away. We're here
                      to answer any questions about fee structure, curriculum,
                      or facilities.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
                        <Phone className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-bold">0303 3569000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
