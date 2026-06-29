import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Video,
  Clock,
  CalendarDays,
  Users,
  CheckCircle2,
  MessageCircle,
  Mail,
  GraduationCap
} from "lucide-react";
import Link from "next/link";
import * as motion from "framer-motion/client";
import { Navbar } from "@/components/Navbar";
import { PageHero } from "@/components/PageHero";
import { programHeroImage } from "@/lib/assets";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";

const coreCourses = [
  {
    title: "Noorani Qaida / Beginners Course",
    description: "The fundamental course for beginners to learn Arabic alphabets and basic pronunciation.",
    icon: <BookOpen className="w-6 h-6 text-primary group-hover:text-white transition-colors" />,
  },
  {
    title: "Nazra Quran with Basic Tajweed",
    description: "Learn to recite the Holy Quran fluently with basic rules of Tajweed.",
    icon: <BookOpen className="w-6 h-6 text-primary group-hover:text-white transition-colors" />,
  },
  {
    title: "Hifz-ul-Quran Memorization",
    description: "Memorize the Holy Quran with proper pronunciation and guidance from expert teachers.",
    icon: <BookOpen className="w-6 h-6 text-primary group-hover:text-white transition-colors" />,
  },
  {
    title: "Quran Translation & Tafseer Course",
    description: "Understand the deep meaning, context, and translation of the Quranic verses.",
    icon: <BookOpen className="w-6 h-6 text-primary group-hover:text-white transition-colors" />,
  },
  {
    title: "مختصر فہم کورس",
    description: "بنیادی تجوید، مختصر ترجمہ و تفسیر، منتخب احادیث، بنیادی مسائل، مختصر سیرت",
    icon: <BookOpen className="w-6 h-6 text-primary group-hover:text-white transition-colors" />,
  }
];

const additionalCourses = [
  "Quranic Arabic Grammar – Nahw & Sarf",
  "Tajweed Course",
  "Fiqh Basics with Salah and Kalma",
  "Seerah & Hadith for Children"
];

const features = [
  {
    title: "One-to-One Classes",
    description: "Personalized attention with 20-30 minute dedicated sessions.",
    icon: <Users className="w-6 h-6 text-primary group-hover:text-white transition-colors" />,
  },
  {
    title: "Online Platforms",
    description: "Classes conducted conveniently via Zoom, Google Meet, or similar apps.",
    icon: <Video className="w-6 h-6 text-primary group-hover:text-white transition-colors" />,
  },
  {
    title: "5 Days a Week",
    description: "Regular classes from Monday to Friday for consistent learning.",
    icon: <CalendarDays className="w-6 h-6 text-primary group-hover:text-white transition-colors" />,
  },
  {
    title: "Free Trial Classes",
    description: "Get 2 to 3 free trial classes to ensure satisfaction before enrolling.",
    icon: <CheckCircle2 className="w-6 h-6 text-primary group-hover:text-white transition-colors" />,
  },
  {
    title: "Qualified Teachers",
    description: "Under the supervision of Male and Female highly qualified teachers.",
    icon: <GraduationCap className="w-6 h-6 text-primary group-hover:text-white transition-colors" />,
  },
  {
    title: "Flexible Timings",
    description: "Timings are flexible and can be adjusted according to children's schedules.",
    icon: <Clock className="w-6 h-6 text-primary group-hover:text-white transition-colors" />,
  }
];

export default function OnlineQuranPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <PageHero
        badge="Welcome to our Academy"
        titleMain="Online"
        titleAccent="Quran Academy"
        image={programHeroImage}
        imageFit="contain"
        description="Learn Quran with Tajweed, Tafseer, and Islamic studies from the comfort of your home with our qualified Male & Female teachers."
      />

      {/* Features Section */}
      <AnimatedSection direction="up" className="py-20 bg-background relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Why <span className="text-primary italic">Choose Us?</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We provide a flexible, engaging, and highly personalized learning experience for students of all ages.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, idx) => (
              <AnimatedSection direction="up" delay={0.1 * idx} key={idx}>
                <div className="group h-full p-6 rounded-2xl bg-white border border-primary/10 hover:border-primary/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Courses Section */}
      <AnimatedSection direction="up" className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              Course Outlines
            </span>
            <h2 className="text-4xl font-black mb-4 tracking-tight text-foreground">Our Core <span className="text-primary italic">Courses</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Comprehensive learning paths designed to build a strong foundation in Islamic education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            {coreCourses.map((course, idx) => (
              <AnimatedSection direction="up" delay={0.1 * idx} key={idx}>
                <Card className="group h-full bg-white border-primary/10 hover:border-primary/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 rounded-[24px]">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                      {course.icon}
                    </div>
                    <CardTitle className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed text-muted-foreground/90">{course.description}</CardDescription>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>

        {/* Additional Courses */}
        <div className="max-w-4xl mx-auto bg-primary/5 rounded-[32px] p-8 md:p-12 border border-primary/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 -z-10" />
          <h3 className="text-2xl font-black mb-6 text-center text-foreground">Additional Recommended Courses</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
            {additionalCourses.map((course, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-card rounded-2xl shadow-sm border border-primary/10 hover:border-primary/30 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="font-bold text-foreground text-sm">{course}</span>
              </div>
            ))}
          </div>
        </div>
        </div>
      </AnimatedSection>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-background relative overflow-hidden">
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -z-10" />
        
        <div className="container mx-auto px-4 text-center max-w-3xl relative z-10">
          <h2 className="text-4xl font-black mb-6 text-foreground tracking-tight">Ready to Start Learning?</h2>
          <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
            Get in touch with us to schedule your free trial classes today. We are available on WhatsApp and Email.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="https://wa.me/923033569000?text=Assalam-o-Alaikum!%20I%20want%20to%20inquire%20about%20the%20Online%20Quran%20Academy." target="_blank" rel="noreferrer" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto min-w-[200px] h-16 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 group hover:scale-[1.02] transition-all duration-300">
                <span className="flex items-center gap-2">
                  WhatsApp Us <MessageCircle className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </a>
            
            <a href="mailto:meridians35102@gmail.com" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto min-w-[200px] h-16 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-2xl font-black text-lg shadow-lg shadow-primary/5 group hover:scale-[1.02] transition-all duration-300">
                <span className="flex items-center gap-2">
                  Email Us <Mail className="w-5 h-5 text-primary group-hover:text-white group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
                </span>
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
