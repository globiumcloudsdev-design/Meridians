"use client";

import { Navbar } from "@/components/Navbar";
import { AnimatedSection } from "@/components/AnimatedSection";
import { PageHero } from "@/components/PageHero";
import { Footer } from "@/components/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Baby,
  BookOpen,
  Beaker,
  Globe,
  Star,
  Zap,
  Award,
  Clock,
  User,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Languages,
  Trophy,
  Heart,
  Music,
  Briefcase,
} from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { FinalCTA } from "@/components/FinalCTA";
import { programHeroImage } from "@/lib/assets";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const programs = [
  {
    id: 1,
    name: "Pre Section (PG to Prep)",
    icon: Baby,
    color: "violet",
    gradient: "from-violet-500/20 to-violet-500/5",
    description:
      "A playful early-learning stage for PG to Prep that builds social skills, curiosity, and school readiness.",
    highlights: [
      "PG to Prep",
      "Play-based learning",
      "Early literacy and numeracy",
      "Social and motor skill development",
      "School readiness support",
    ],
    duration: "3 Years",
    ageGroup: "PG to Prep",
  },
  {
    id: 2,
    name: "Primary Education",
    icon: BookOpen,
    color: "emerald",
    gradient: "from-emerald-500/20 to-emerald-500/5",
    description:
      "Grades 1 to 5 focused on building strong reading, writing, numeracy, and learning habits.",
    highlights: [
      "Grades 1 to 5",
      "Foundational literacy and numeracy",
      "Curiosity-led classroom learning",
      "Creative activities and expression",
      "Values and confidence building",
    ],
    duration: "5 Years",
    ageGroup: "Grades 1-5",
  },
  {
    id: 3,
    name: "Elementary Education",
    icon: Beaker,
    color: "blue",
    gradient: "from-blue-500/20 to-blue-500/5",
    description:
      "Grades 6 to 8 that strengthen subject understanding, discipline, and practical learning.",
    highlights: [
      "Grades 6 to 8",
      "Subject-wise concept strengthening",
      "Activity-based science and math learning",
      "Communication and teamwork",
      "Independent study habits",
    ],
    duration: "3 Years",
    ageGroup: "Grades 6-8",
  },
  {
    id: 4,
    name: "Secondary Education",
    icon: Globe,
    color: "amber",
    gradient: "from-amber-500/20 to-amber-500/5",
    description:
      "Grades 9 to 10 with focused academic preparation for board examinations and future studies.",
    highlights: [
      "Grades 9 to 10",
      "Matric level preparation",
      "Board exam readiness",
      "Core subject mastery",
      "Exam strategy and revision support",
    ],
    duration: "2 Years",
    ageGroup: "Grades 9-10",
  },
  {
    id: 5,
    name: "Higher Secondary Education",
    icon: Award,
    color: "rose",
    gradient: "from-rose-500/20 to-rose-500/5",
    description:
      "Grades 11 to 12 designed for intermediate and college-level preparation with future career planning.",
    highlights: [
      "Grades 11 to 12",
      "Intermediate / college preparation",
      "Stream-based subject study",
      "Board and entrance exam support",
      "Career guidance and counseling",
    ],
    duration: "2 Years",
    ageGroup: "Grades 11-12",
  },
];

const highlights = [
  {
    title: "STEM Excellence",
    icon: Cpu,
    description: "State-of-the-art labs and technology-integrated learning.",
  },
  {
    title: "Language Mastery",
    icon: Languages,
    description: "Multi-lingual proficiency programs in major languages.",
  },
  {
    title: "Competitive Edge",
    icon: Trophy,
    description: "Systematic preparation for national level exams.",
  },
  {
    title: "Holistic Growth",
    icon: Heart,
    description: "Focus on emotional intelligence and moral values.",
  },
  {
    title: "Arts & Culture",
    icon: Music,
    description: "Rich exposure to creative arts and heritage.",
  },
  {
    title: "Leadership",
    icon: TrendingUp,
    description: "Student councils and leadership training workshops.",
  },
  {
    title: "Career Path",
    icon: Briefcase,
    description: "Expert guidance for university and career choices.",
  },
  {
    title: "Life Skills",
    icon: Zap,
    description: "Essential training for the modern world challenges.",
  },
];

export default function Programs() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <PageHero
        badge="Pathways to Success"
        titleMain="Our Academic"
        titleAccent="Programs"
        image={programHeroImage}
        imageFit="contain"
        description="Primary, elementary, secondary, and higher secondary education designed to support every stage of student growth."
      />

      {/* Programs Overview */}
      <AnimatedSection direction="right" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Learning Path"
            titleAccent="By Stage"
            description="Each program is structured to meet the academic needs of that grade band, from early foundations to college preparation."
            align="center"
          />

          <Carousel
            opts={{ align: "start", loop: false }}
            className="relative mt-4"
          >
            <CarouselContent className="-ml-4">
              {programs.map((program, idx) => {
                const Icon = program.icon;
                return (
                  <CarouselItem
                    key={program.id}
                    className="pl-4 basis-full md:basis-1/2 xl:basis-1/3"
                  >
                    <AnimatedSection
                      direction="up"
                      delay={0.1 * idx}
                      className="h-full"
                    >
                      <Card className="group relative h-full border-primary/20 bg-card/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col overflow-hidden border-t-4 border-t-primary">
                        <div
                          className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${program.gradient} blur-3xl -z-10 group-hover:scale-150 transition-transform duration-700`}
                        />

                        <CardHeader className="pb-4">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                              <Icon className="w-8 h-8" />
                            </div>
                            <div className="h-[2px] flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
                          </div>
                          <CardTitle className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">
                            {program.name}
                          </CardTitle>
                          <CardDescription className="text-base leading-relaxed text-muted-foreground/90 pt-2">
                            {program.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="flex-1 flex flex-col pt-0">
                          <div className="grid grid-cols-2 gap-4 py-4 border-y border-primary/10 mb-6 bg-primary/5 rounded-xl px-4">
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">
                                Duration
                              </p>
                              <p className="text-sm font-bold flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-primary" />
                                {program.duration}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">
                                Age Group
                              </p>
                              <p className="text-sm font-bold flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-primary" />
                                {program.ageGroup}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4 flex-1">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary/70">
                              Key Highlights
                            </p>
                            <ul className="space-y-3">
                              {program.highlights.map((highlight, idx2) => (
                                <li
                                  key={idx2}
                                  className="flex items-center gap-3 group/item"
                                >
                                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary transition-colors">
                                    <CheckCircle2 className="w-3 h-3 text-primary group-hover/item:text-white" />
                                  </div>
                                  <span className="text-sm font-medium text-foreground/80 group-hover/item:text-primary transition-colors">
                                    {highlight}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-8 pt-6 border-t border-primary/10">
                            <Button
                              asChild
                              className="w-full h-12 bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 group-hover:scale-[1.02] transition-transform"
                            >
                              <Link
                                href="/admission-form"
                                className="flex items-center justify-center gap-2 font-bold"
                              >
                                Enroll Now
                                <Star className="w-4 h-4 fill-current" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </AnimatedSection>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden lg:flex -left-2 border-primary/20 bg-background/95 backdrop-blur-sm" />
            <CarouselNext className="hidden lg:flex -right-2 border-primary/20 bg-background/95 backdrop-blur-sm" />
          </Carousel>
        </div>
      </AnimatedSection>

      {/* Curriculum Highlights */}
      <AnimatedSection direction="left" className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="What Makes Our"
            titleAccent="Curriculum"
            titleAccentSuffix="Special"
            align="center"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <AnimatedSection direction="up" delay={0.1 * idx} key={idx}>
                  <div className="group h-full p-6 rounded-2xl bg-white border border-primary/10 hover:border-primary/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6 text-primary group-hover:text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      <FinalCTA
        title="Choose Your Path to"
        titleAccent="Excellence"
        description="Find the right program for your grade level and take the next step with confidence."
        primaryBtnText="Explore Admissions"
        primaryBtnLink="/admission-form"
      />

      <Footer />
    </div>
  );
}
