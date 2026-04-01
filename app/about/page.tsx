"use client";
import { Navbar } from "@/components/Navbar";
import { AnimatedSection } from "@/components/AnimatedSection";
import { PageHero } from "@/components/PageHero";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Target,
  Eye,
  Heart,
  Award,
  TrendingUp,
  ShieldCheck,
  Globe,
  Star,
  BookOpen,
  Users,
  Sprout,
  Rocket,
  Compass,
  ArrowRight,
} from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { FinalCTA } from "@/components/FinalCTA";
import { THEME } from "@/lib/theme";
import { getCurrentAcademicSession, getImageSrc } from "@/lib/utils";
import { aboutAssets } from "@/lib/assets";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <PageHero
        badge="Our Legacy"
        titleMain="About"
        titleAccent="Meridians"
        image="https://images.unsplash.com/photo-1523050335392-9bc5675e7d53?auto=format&fit=crop&w=1920&q=80"
        description="Nurturing curiosity, fostering creativity, and building the foundation for lifelong excellence since our inception."
      />

      {/* Mission & Vision - The "Purpose" Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <div className="space-y-12">
                <SectionHeader
                  title="The"
                  titleAccent="Foundation"
                  titleAccentSuffix="of Our Future"
                  description="At Meridian's Group of Education, we don't just teach; we inspire. Our educational philosophy is built on the belief that every child has a unique potential waiting to be discovered."
                />

                <div className="space-y-6">
                  {[
                    {
                      icon: Target,
                      title: "Our Mission",
                      desc: "To provide transformative education that develops intellectually curious, morally grounded, and socially responsible individuals.",
                      color: "primary",
                    },
                    {
                      icon: Eye,
                      title: "Our Vision",
                      desc: "To be a leading global institution recognized for character development and academic excellence.",
                      color: "secondary",
                    },
                    {
                      icon: Heart,
                      title: "Our Core Values",
                      desc: "Excellence, Integrity, Innovation, and Inclusivity are the pillars that support everything we do.",
                      color: "info",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-6 p-8 rounded-[32px] bg-card/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-500 group"
                    >
                      <div
                        className={`w-16 h-16 rounded-2xl bg-${item.color}/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-${item.color} transition-all duration-500`}
                      >
                        <item.icon
                          className={`w-8 h-8 text-${item.color} group-hover:text-white transition-colors`}
                        />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black mb-2 tracking-tight group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" className="relative">
              <div className="relative pt-12">
                <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-[100px] -z-10" />
                <div className="relative rounded-[48px] overflow-hidden shadow-2xl border-[12px] border-white/50 backdrop-blur-md">
                  <img
                    src={getImageSrc(aboutAssets["The Foundation"][0])}
                    alt="Our Foundation"
                    className="w-full aspect-[4/5] object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent mix-blend-multiply" />
                </div>

                {/* Floating Counter Card */}
                <div className="absolute -bottom-10 -left-10 bg-white/80 backdrop-blur-xl p-8 rounded-[32px] shadow-2xl border border-white/20 hidden md:block">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-success/20 flex items-center justify-center text-success animate-pulse">
                      <TrendingUp className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-4xl font-black text-foreground tracking-tighter">
                        15+
                      </p>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                        Years Legacy
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Organized Icons */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Why Choose"
            titleAccent="Meridians?"
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Safety & Care",
                desc: "100% secure campus environment with deep emphasis on emotional wellbeing.",
                color: "success",
              },
              {
                icon: Globe,
                title: "Global Standards",
                desc: "Curriculum designed to meet international educational benchmarks and requirements.",
                color: "info",
              },
              {
                icon: Star,
                title: "Award Winning",
                desc: "Recognized nationally for innovative teaching methods and excellence.",
                color: "warning",
              },
              {
                icon: Award,
                title: "Elite Faculty",
                desc: "PhD & Master-certified educators with decades of combined experience.",
                color: "destructive",
              },
            ].map((item, idx) => (
              <AnimatedSection direction="up" delay={idx * 0.1} key={idx}>
                <div className="h-full bg-card/40 backdrop-blur-md p-10 rounded-[40px] border border-primary/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group">
                  <div
                    className={`w-20 h-20 bg-${item.color}/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-${item.color} group-hover:text-white transition-all duration-500 text-${item.color}`}
                  >
                    <item.icon className="w-10 h-10 group-hover:rotate-12 transition-transform" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {item.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Journey & Milestones */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-foreground rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -ml-32 -mb-32" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-secondary font-black text-sm uppercase tracking-[0.3em] mb-4 block">
                  Our Story
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-[1.1]">
                  Growing Together, Shaping{" "}
                  <span className="text-secondary italic">Excellence</span>
                </h2>
                <div className="space-y-6 text-white/70 text-lg leading-relaxed">
                  <p>
                    Founded from a single classroom, Meridian's has flourished
                    into a premier educational hub. Our journey is paved with
                    stories of thousands of students who found their purpose
                    here.
                  </p>
                  <p>
                    We blend modern infrastructure with ancient wisdom to create
                    a learning environment that is both cutting-edge and deeply
                    rooted in values.
                  </p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/10">
                <h3 className="text-2xl font-black text-white mb-8">
                  Notable Milestones
                </h3>
                <div className="space-y-6">
                  {[
                    "Nationally Recognized Academic Programs",
                    "State-of-the-Art Research & STEM Labs",
                    "Global Alumni Network across 20+ Countries",
                    "Partnerships with Top Tier Universities",
                    "Student-Led Innovation & Research Hubs",
                  ].map((text, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 text-white/90"
                    >
                      <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-secondary" />
                      </div>
                      <span className="font-medium">{text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty - Premium Grid */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <SectionHeader
              title="Our"
              titleAccent="Inspirations"
              description="The dedicated team at the heart of Meridians, committed to shaping future world leaders."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              {
                name: "Dr. Rajesh Kumar",
                role: "Principal",
                color: "info",
                icon: BookOpen,
                image: getImageSrc(aboutAssets["Our Inspirations"][0]),
              },
              {
                name: "Prof. Anita Singh",
                role: "Academics Head",
                color: "success",
                icon: Users,
                image: getImageSrc(aboutAssets["Our Inspirations"][1]),
              },
              {
                name: "Mr. Vikram Sharma",
                role: "STEM Director",
                color: "warning",
                icon: Target,
                image: getImageSrc(aboutAssets["Our Inspirations"][2]),
              },
              {
                name: "Ms. Priya Patel",
                role: "Arts Dean",
                color: "secondary",
                icon: Heart,
                image: getImageSrc(aboutAssets["Our Inspirations"][3]),
              },
            ].map((faculty, idx) => (
              <AnimatedSection direction="up" delay={idx * 0.1} key={idx}>
                <div className="group text-center">
                  <div className="relative mb-8 pt-4">
                    <div
                      className={`absolute inset-0 bg-${faculty.color}/10 rounded-[48px] rotate-6 group-hover:rotate-0 transition-transform duration-500`}
                    />
                    <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden border-4 border-white shadow-xl">
                      <img
                        src={faculty.image}
                        alt={faculty.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                        <div className="flex justify-center gap-3">
                          <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-primary transition-all">
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black mb-1 group-hover:text-primary transition-colors">
                    {faculty.name}
                  </h3>
                  <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                    {faculty.role}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA
        title="Be Part of Our"
        titleAccent="Legacy"
        description={`Join Meridians Group of Education and give your child the foundation they deserve. Applications for ${getCurrentAcademicSession()} are filling up fast.`}
        primaryBtnText="Enroll Successfully"
        primaryBtnLink="/admissions"
        secondaryBtnText="Contact Support"
        secondaryBtnLink="/contact"
      />

      <Footer />
    </div>
  );
}
