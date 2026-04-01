"use client";
import { useEffect, useState, type ComponentType } from "react";
import { Navbar } from "@/components/Navbar";
import { PageHero } from "@/components/PageHero";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  CheckCircle,
  Calendar,
  FileText,
  Users,
  ArrowRight,
  Info,
  Clock,
  Phone,
  Mail,
  LocateFixed,
  Award,
  BookOpen,
  ClipboardCheck,
  Building2,
  Globe,
  Star,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { ContactCard } from "@/components/ContactCard";
import { FinalCTA } from "@/components/FinalCTA";
import { AnimatedSection } from "@/components/AnimatedSection";
import { API_TIMELINE } from "@/lib/api/endpoints";
import { getCurrentAcademicSession } from "@/lib/utils";
import { admissionsHeroImage } from "@/lib/assets";
import { TimelineEvent } from "@/lib/types";

export default function Admissions() {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(true);

  useEffect(() => {
    const fetchTimelineEvents = async () => {
      try {
        const response = await fetch(API_TIMELINE);
        if (!response.ok) {
          throw new Error("Failed to fetch timeline events");
        }

        const data = await response.json();
        setTimelineEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching timeline events:", error);
        setTimelineEvents([]);
      } finally {
        setTimelineLoading(false);
      }
    };

    fetchTimelineEvents();
  }, []);

  const resolveIcon = (iconName: string): ComponentType<{ className?: string }> => {
    const iconCandidate = (LucideIcons as Record<string, unknown>)[iconName];
    return typeof iconCandidate === "function"
      ? (iconCandidate as ComponentType<{ className?: string }>)
      : Calendar;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <PageHero
        badge={`Enrollment ${getCurrentAcademicSession()}`}
        titleMain="Join Our"
        titleAccent="Community"
        image={admissionsHeroImage}
        imageFit="contain"
        description="Discover the simple steps to join Meridians and unlock your child's true potential."
      />

      {/* Eligibility & Process */}
      <section className="py-24 relative overflow-hidden bg-background">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Eligibility Criteria */}
            <AnimatedSection direction="left">
              <div className="space-y-8">
                <SectionHeader
                  badge="Requirements"
                  title="Who Can"
                  titleAccent="Apply?"
                />

                <div className="grid grid-cols-1 gap-4">
                  {[
                    {
                      text: "Minimum age as per curriculum level",
                      icon: Award,
                    },
                    {
                      text: "Academic performance in previous classes",
                      icon: BookOpen,
                    },
                    { text: "Entrance assessment exam", icon: ClipboardCheck },
                    { text: "Personal interview with committee", icon: Users },
                    { text: "Medical fitness certificate", icon: Info },
                    {
                      text: "Transfer certificate (if applicable)",
                      icon: FileText,
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center gap-4 p-5 rounded-2xl bg-card border border-primary/10 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <item.icon className="w-6 h-6 text-primary group-hover:text-white" />
                      </div>
                      <span className="text-lg font-medium text-foreground/90">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Admission Process Steps */}
            <AnimatedSection direction="right">
              <div className="space-y-8">
                <div>
                  <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    Step by Step
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
                    Our Admission <br />
                    <span className="text-secondary">Journey</span>
                  </h2>
                </div>

                <div className="relative space-y-8 before:absolute before:left-[1.625rem] before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-primary/80 before:via-primary/50 before:to-transparent">
                  {[
                    {
                      step: 1,
                      title: "Pick Your Format",
                      desc: "Fill out the online application or visit our campus for a physical form.",
                      color: "bg-primary",
                    },
                    {
                      step: 2,
                      title: "Submit Credentials",
                      desc: "Provide academic records, birth certificate, and necessary identification.",
                      color: "bg-primary/80",
                    },
                    {
                      step: 3,
                      title: "Assessment Test",
                      desc: "Students undergo a friendly assessment to understand their learning level.",
                      color: "bg-primary/60",
                    },
                    {
                      step: 4,
                      title: "Parent Counseling",
                      desc: "A dedicated session to align the family's vision with our educational goals.",
                      color: "bg-primary/40",
                    },
                    {
                      step: 5,
                      title: "Welcome Aboard",
                      desc: "Final confirmation, fee deposit, and introduction to the Meridians family.",
                      color: "bg-primary/20",
                    },
                  ].map((item) => (
                    <div key={item.step} className="relative pl-14 group">
                      <div
                        className={`absolute left-0 w-13 h-13 rounded-2xl ${item.color} text-white flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300 z-10`}
                      >
                        {item.step}
                      </div>
                      <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
                        <h4 className="text-xl font-black text-foreground mb-2">
                          {item.title}
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Modern Horizontal Timeline for Dates */}
      <section className="py-24 bg-muted/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight mb-4">
              Timeline for{" "}
              <span className="text-primary italic font-serif">Admissions</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Mark your calendars for these critical milestones in the upcoming
              academic session.
            </p>
          </div>

          {timelineLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={`timeline-skeleton-${idx}`}
                  className="bg-card p-1 rounded-3xl border border-primary/10 overflow-hidden"
                >
                  <div className="bg-primary/5 rounded-[22px] p-6 h-full space-y-5">
                    <div className="flex justify-between items-start">
                      <Skeleton className="h-12 w-12 rounded-xl" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {timelineEvents.map((item, idx) => {
                const Icon = resolveIcon(item.icon);

                return (
                  <AnimatedSection key={item._id || `${item.title}-${idx}`} direction="up" delay={idx * 0.1}>
                    <div className="group bg-card p-1 rounded-3xl border border-primary/10 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-primary/5 overflow-hidden">
                      <div className="bg-primary/5 rounded-[22px] p-6 h-full relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                            <Icon className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] font-black bg-primary text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-primary/20">
                            {item.date}
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-foreground mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Final Action Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <div className="p-10 rounded-[40px] bg-slate-900 text-white relative h-full overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
                <div className="relative z-10">
                  <SectionHeader
                    title="Need More"
                    titleAccent="Clarity?"
                    description="Our expert admission counselors are available to walk you through the nuances of our curriculum and campus culture."
                    className="text-white"
                    accentItalic={true}
                    textColor="white"
                  />

                  <div className="space-y-6 text-white mt-12 lg:mt-20">
                    <ContactCard
                      icon={Phone}
                      title="Call Center"
                      content="0303 3569000"
                      className="bg-white/10 border-white/10 text-white"
                      textColor="white"
                    />
                    <ContactCard
                      icon={Mail}
                      title="Email Support"
                      content="meridians36109@gmail.com"
                      className="bg-white/10 border-white/10 text-white"
                      textColor="white"
                    />
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="p-12 rounded-[40px] border-2 border-primary/20 bg-primary/5 hover:bg-primary/[0.08] transition-colors relative group">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-secondary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="text-center lg:text-left">
                  <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto lg:mx-0 mb-8 shadow-2xl shadow-primary/30">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-4xl font-black text-foreground mb-6">
                    Take the <br />
                    <span className="text-primary italic font-serif">
                      First Step
                    </span>
                  </h3>
                  <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                    Begin your application process today. The future of your
                    child starts here, within the walls of Meridians excellence.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      asChild
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white h-16 rounded-2xl px-10 text-lg font-bold shadow-xl shadow-primary/20 flex-1"
                    >
                      <Link href="/admission-form">
                        Apply Online Now <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-primary/30 bg-white h-16 rounded-2xl px-10 text-lg font-bold flex-1"
                    >
                      <Link href="/contact">Visit Campus</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
