"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import {
  ArrowRight,
  GraduationCap,
  Users,
  Trophy,
  BookOpen,
  Lightbulb,
  Heart,
  Star,
  Award,
  CheckCircle2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { THEME } from "@/lib/theme";
import { SectionHeader } from "./SectionHeader";
import { API_POSTERS_ACTIVE } from "@/lib/api/endpoints";
import { IPoster } from "@/lib/types";

const heroSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1920&q=80",
    title: "Empowering Minds,",
    highlight: "Shaping Futures",
    description:
      "Welcome to Meridian's Group of Education, where we nurture curiosity, foster creativity, and build the foundation for lifelong excellence.",
    badge: "Admissions Open 2024-25",
  },
  {
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1920&q=80",
    title: "World Class,",
    highlight: "Quality Education",
    description:
      "Providing innovative learning environments and modern technology to prepare students for a globalized world.",
    badge: "Limited Seats Available",
  },
  {
    image:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1920&q=80",
    title: "Discover Your",
    highlight: "True Potential",
    description:
      "Join a community that celebrates diversity and encourages every student to find their unique path to success.",
    badge: "Student-Centered Learning",
  },
  {
    image:
      "https://images.unsplash.com/photo-1510531704581-5b2870972060?auto=format&fit=crop&w=1920&q=80",
    title: "Beyond The",
    highlight: "Classroom",
    description:
      "Extensive extracurricular programs including sports, arts, and leadership activities for a well-rounded growth.",
    badge: "Holistic Development",
  },
  // {
  //   image:
  //     "https://images.unsplash.com/photo-1564927435849-9a74083d882f?auto=format&fit=crop&w=1920&q=80",
  //   title: "Inquiry Based",
  //   highlight: "Scientific Minds",
  //   description:
  //     "State-of-the-art laboratories and STEM programs that prepare students for the careers of tomorrow.",
  //   badge: "Innovation & STEM",
  // },
  {
    image:
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1920&q=80",
    title: "Nurturing Global",
    highlight: "Citizens",
    description:
      "Focusing on character, ethics, and global awareness to shape leaders who care about our world's future.",
    badge: "Join Our Legacy",
  },
];

export const Hero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activePoster, setActivePoster] = useState<IPoster | null>(null);
  const [showPoster, setShowPoster] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchActivePoster = async () => {
      try {
        const dismissed = localStorage.getItem("heroPosterDismissed");
        const dismissedAt = localStorage.getItem("heroPosterDismissedAt");

        if (dismissed === "true" && dismissedAt) {
          const elapsed = Date.now() - Number(dismissedAt);
          const oneDayMs = 24 * 60 * 60 * 1000;
          if (elapsed < oneDayMs) {
            return;
          }
        }

        const response = await fetch(API_POSTERS_ACTIVE);
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        if (data?._id && data?.imageUrl && data?.isActive) {
          setActivePoster(data);
          setShowPoster(true);
        }
      } catch (error) {
        console.error("Error fetching active poster:", error);
      }
    };

    fetchActivePoster();
  }, []);

  const handleClosePoster = () => {
    localStorage.setItem("heroPosterDismissed", "true");
    localStorage.setItem("heroPosterDismissedAt", String(Date.now()));
    setShowPoster(false);
  };

  return (
    <>
      {activePoster && showPoster && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl h-[80vh] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={activePoster.imageUrl}
              alt={activePoster.title || "Poster"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

            <button
              onClick={handleClosePoster}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 text-white border border-white/20 flex items-center justify-center hover:bg-black/80 transition-colors"
              aria-label="Close poster"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 z-10">
              <div className="max-w-3xl text-white space-y-4">
                {activePoster.title && (
                  <h2 className="text-2xl sm:text-4xl font-black tracking-tight">{activePoster.title}</h2>
                )}
                {activePoster.subtitle && (
                  <p className="text-sm sm:text-lg text-white/85 leading-relaxed">{activePoster.subtitle}</p>
                )}
                {activePoster.buttonText && activePoster.buttonUrl && (
                  <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                    <Link href={activePoster.buttonUrl}>{activePoster.buttonText}</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="relative min-h-[100dvh] w-full overflow-hidden flex items-center bg-black">
        {/* Background Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${currentIndex}`}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-black/50 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10" />
            <img
              src={heroSlides[currentIndex].image}
              alt="Hero Background"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-32 pb-20 md:py-0">
          <div className="max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentIndex}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={THEME.animations.transition}
                className="flex flex-col items-center md:items-start text-center md:text-left"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-bold mb-6 sm:mb-8">
                  <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
                  {heroSlides[currentIndex].badge}
                </div>

                <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 sm:mb-8 leading-[1.1] sm:leading-[1.05] drop-shadow-2xl">
                  {heroSlides[currentIndex].title}{" "}
                  <span className="text-secondary italic block brightness-110">
                    {heroSlides[currentIndex].highlight}
                  </span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-white/80 mb-8 sm:mb-12 max-w-2xl font-medium leading-relaxed drop-shadow-lg px-4 md:px-0">
                  {heroSlides[currentIndex].description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto px-4 sm:px-0">
                  <Button
                    asChild
                    size="xl"
                    className="w-full sm:w-auto shadow-2xl bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:scale-105 transition-transform"
                  >
                    <Link href="/admission-form">
                      Enroll Now{" "}
                      <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="xl"
                    className="w-full sm:w-auto border-white/30 text-black hover:bg-white/10 backdrop-blur-sm transition-all"
                  >
                    <Link href="/about">Explore Campus</Link>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Stats/Social Proof moved to the right */}
          <div className="absolute right-4 sm:right-8 lg:right-12 bottom-32 hidden lg:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={`stats-${currentIndex}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: [0, -15, 0],
                }}
                exit={{ opacity: 0, x: 50 }}
                transition={{
                  ...THEME.animations.transition,
                  y: THEME.animations.float.transition,
                }}
                className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[3rem] shadow-2xl group/stats cursor-default hover:bg-white/10 transition-colors"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        className="w-16 h-16 rounded-full border-4 border-white/20 bg-muted overflow-hidden blur-none shadow-xl group-hover/stats:scale-110 transition-transform"
                      >
                        <img
                          src={`https://i.pravatar.cc/150?u=${i + 15}`}
                          alt="user"
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>
                  <div className="text-white text-left">
                    <div className="flex text-secondary mb-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-6 h-6 fill-current" />
                      ))}
                    </div>
                    <p className="text-xl font-black tracking-tight text-white/95 mb-1">
                      Trusted by 5,000+
                    </p>
                    <p className="text-sm font-bold text-white/60 uppercase tracking-widest">
                      Future Achievers
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 hidden md:flex flex-col items-center gap-2"
        >
          <span className="text-white/50 text-xs font-medium uppercase tracking-[0.2em]">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center p-1"
          >
            <div className="w-1 h-2 bg-primary rounded-full" />
          </motion.div>
        </motion.div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 right-4 sm:bottom-12 sm:right-12 z-40 flex gap-2 sm:gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 transition-all duration-500 rounded-full ${currentIndex === index
                  ? "w-12 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                  : "w-4 bg-white/30 hover:bg-white/50"
                }`}
            />
          ))}
        </div>
      </section>

      {/* Scrolling Ticker (Patti) */}
      <div className="bg-primary overflow-hidden py-4 border-y border-white/10 relative z-40">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex whitespace-nowrap items-center gap-12"
        >
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-12 text-white font-black text-lg uppercase tracking-[0.3em]"
            >
              <span>Admissions Open 2024-25</span>
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span>Expert Faculty</span>
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span>Modern Laboratories</span>
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span>Holistic Development</span>
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span>Global Standard Education</span>
              <span className="w-2 h-2 rounded-full bg-secondary" />
            </div>
          ))}
        </motion.div>
      </div>
    </>
  );
};

const Counter = ({
  value,
  duration = 2,
}: {
  value: string;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const target = parseInt(value.replace(/[,+]/g, ""));
  const suffix = value.replace(/[0-9,]/g, "");

  useEffect(() => {
    let start = 0;
    const increment = target / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [target, duration]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export const Stats: React.FC = () => (
  <div className="relative z-30 mt-20 px-4">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        animate={{ y: [0, -10, 0] }}
        transition={{
          opacity: { duration: 0.8 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
        className="bg-gradient-to-br from-[#102c26] via-[#1a1c1e] to-[#0d1f1b] rounded-[3rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden group"
      >
        {/* Animated Background Glows */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[120px] -mr-40 -mt-40"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/20 rounded-full blur-[120px] -ml-40 -mb-40"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative z-10">
          {[
            {
              label: "Students enrolled",
              value: "1,500+",
              color: "text-secondary",
              glow: "group-hover:text-secondary-foreground",
            },
            { label: "Expert Teachers", value: "80+", color: "text-white" },
            {
              label: "Quality Programs",
              value: "25+",
              color: "text-warning",
            },
            {
              label: "Success Stories",
              value: "12,000+",
              color: "text-success",
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10, scale: 1.05 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center md:text-left space-y-3 cursor-default transition-all duration-300"
            >
              <div
                className={`text-4xl md:text-6xl font-black ${stat.color} tracking-tighter drop-shadow-lg`}
              >
                <Counter value={stat.value} />
              </div>
              <div className="text-white/60 text-xs md:text-sm font-bold uppercase tracking-[0.2em] group-hover:text-white/90 transition-colors">
                {stat.label}
              </div>
              <div className="h-1 w-12 bg-white/10 rounded-full mx-auto md:mx-0 group-hover:w-20 group-hover:bg-primary transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

export const Features: React.FC = () => (
  <section className="py-24 bg-muted/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-6"
        >
          Our Programs
        </motion.div>
        <h2 className="text-3xl md:text-5xl font-black mb-6">
          Innovative Learning Approach
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
          We combine traditional values with modern technology to provide a
          comprehensive educational experience that prepares students for the
          future.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          {
            icon: GraduationCap,
            title: "Academic Excellence",
            desc: "Rigorous curriculum focused on critical thinking and practical application in real-world scenarios.",
            image: "/assets/images/program1.png",
            color: "text-info",
          },
          {
            icon: Lightbulb,
            title: "Creative Classes",
            desc: "Art, music, and drama programs designed to spark imagination and nurture artistic innovation.",
            image: "/assets/images/program2.jpg",
            color: "text-warning",
          },
          {
            icon: Trophy,
            title: "Sports & Arts",
            desc: "Comprehensive extracurricular activities for holistic physical, mental, and social growth.",
            image: "/assets/images/program3.png",
            color: "text-success",
          },
        ].map((feature, idx) => (
          <AnimatedSection
            key={idx}
            direction="up"
            delay={idx * 0.1}
            className="h-full"
          >
            <div className="bg-card hover:bg-background h-full rounded-[2.5rem] border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] group">
              <div className="h-64 relative overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div
                  className={`absolute top-6 left-6 w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center ${feature.color} shadow-xl transform -rotate-6 group-hover:rotate-0 transition-transform duration-500`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="p-10">
                <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  {feature.desc}
                </p>
                <div className="mt-8 pt-6 border-t border-border/50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <span className="text-primary font-black text-sm uppercase tracking-tighter">
                    Read More
                  </span>
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export const FunGallery: React.FC = () => (
  <section className="py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div className="max-w-xl text-left">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 italic">
            Life at Meridian's
          </h2>
          <p className="text-lg text-muted-foreground">
            A glimpse into the vibrant atmosphere where our students grow, play,
            and learn together every day.
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/gallery">View Full Gallery</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[600px]">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="md:col-span-8 relative rounded-3xl overflow-hidden cursor-pointer"
        >
          <img
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80"
            alt="School activities"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
            <h4 className="text-white text-2xl font-bold">
              Classroom Creativity
            </h4>
            <p className="text-white/80">Interactive learning sessions</p>
          </div>
        </motion.div>

        <div className="md:col-span-4 grid grid-rows-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative rounded-3xl overflow-hidden cursor-pointer"
          >
            <img
              src="/assets/images/program3.png"
              alt="Sports"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative rounded-3xl overflow-hidden cursor-pointer"
          >
            <img
              src="/assets/images/program1.png"
              alt="Science"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

export const WhyChooseUs: React.FC = () => (
  <AnimatedSection direction="up" className="py-24 bg-background">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
          Why Choose <span className="text-primary italic">Meridian's?</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We are dedicated to providing an exceptional educational experience
          that shapes leaders of tomorrow with values and innovation.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: Award,
            title: "Academic Excellence",
            description:
              "State-of-the-art curriculum and experienced faculty focused on student success.",
            color: "text-info",
          },
          {
            icon: Users,
            title: "Community Focus",
            description:
              "Strong emphasis on values, ethics, and character development in a supportive environment.",
            color: "text-destructive",
          },
          {
            icon: Lightbulb,
            title: "Innovation",
            description:
              "Modern teaching methods and technology integration for a 21st-century education.",
            color: "text-warning",
          },
          {
            icon: BookOpen,
            title: "Holistic Growth",
            description:
              "A perfect balance of academics, sports, arts, and extracurricular activities.",
            color: "text-success",
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-card p-8 rounded-[2rem] border border-border/50 hover:border-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/5 group"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-muted/50 group-hover:bg-white shadow-sm group-hover:shadow-md transition-all ${item.color}`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </AnimatedSection>
);

export const CampusFacilities: React.FC = () => (
  <section className="py-24 bg-white/50 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div className="max-w-xl text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-black uppercase tracking-widest mb-6"
          >
            Explore Campus
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-black mb-6">
            World-Class Facilities
          </h2>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed">
            We provide our students with state-of-the-art infrastructure and
            modern learning environments designed to foster innovation and
            physical well-being.
          </p>
        </div>
        {/* <Button
          asChild
          variant="outline"
          className="rounded-full shadow-sm hover:shadow-md transition-all"
        >
          <Link href="/gallery" className="flex items-center gap-2">
            Explore More Facilities <ArrowRight className="w-4 h-4" />
          </Link>
        </Button> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Advanced Library",
            image:
              "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
            category: "Academics",
            span: "lg:col-span-2 lg:row-span-2",
          },
          {
            title: "Modern Science Lab",
            image:
              "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
            category: "Innovation",
          },
          // {
          //   title: "Digital Smart Lab",
          //   image:
          //     "https://images.unsplash.com/photo-1509062522246-373b1d7971d6?auto=format&fit=crop&w=800&q=80",
          //   category: "Technology",
          // },
          {
            title: "Indoor Sports Arena",
            image:
              "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
            category: "Sports",
            span: "lg:col-span-2",
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
            className={`relative rounded-[2.5rem] overflow-hidden group h-[300px] lg:h-auto ${item.span || ""}`}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            <div className="absolute bottom-10 left-10 text-white">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-2 block">
                {item.category}
              </span>
              <h3 className="text-2xl font-black tracking-tight">
                {item.title}
              </h3>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="absolute top-10 right-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white"
            >
              <ArrowRight className="w-5 h-5 -rotate-45" />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export const SplitHighlight: React.FC<{
  title: string;
  description: string;
  image: string;
  badge: string;
  reverse?: boolean;
}> = ({ title, description, image, badge, reverse }) => (
  <section className={`py-24 ${reverse ? "bg-muted/30" : "bg-background"}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${reverse ? "lg:flex-row-reverse" : ""}`}
      >
        <motion.div
          initial={{ opacity: 0, x: reverse ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={`relative ${reverse ? "lg:order-last" : ""}`}
        >
          <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] -rotate-3 transition-transform group-hover:rotate-0" />
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl group">
            <img
              src={image}
              alt={title}
              className="w-full h-[350px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
            {badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
            {title}
          </h2>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed">
            {description}
          </p>
          <Button
            asChild
            size="xl"
            className="rounded-full shadow-lg hover:shadow-primary/20 transition-all"
          >
            <Link href="/programs">
              Discover More <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  </section>
);

export const AboutSection: React.FC = () => (
  <section className="py-24 bg-background overflow-hidden relative">
    {/* Decorative blur elements */}
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64 z-0" />
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -ml-64 -mb-64 z-0" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <AnimatedSection direction="left" className="relative group">
          <div className="relative">
            {/* Decorative background element */}
            <div className="absolute -inset-4 bg-primary/5 rounded-[4rem] rotate-3 group-hover:rotate-0 transition-transform duration-700" />

            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group-hover:scale-[1.02] transition-transform duration-700">
              <img
                src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80"
                alt="About Meridians"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:opacity-0 transition-opacity duration-700" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-primary/10 hidden md:block group-hover:-translate-y-4 transition-transform duration-500 z-20">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-4xl font-black text-foreground tracking-tighter">
                    15+
                  </p>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none">
                    Years Legacy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <div className="space-y-10">
          <AnimatedSection direction="right">
            <SectionHeader
              badge="Welcome to Meridian's"
              title="Empowering the Next"
              titleAccent="Generations"
              description="At Meridian's Group of Education, we redefine pedagogy through innovation and tradition. Our goal is to nurture intellectually curious and morally grounded global citizens."
            />
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <AnimatedSection
              direction="up"
              delay={0.1}
              className="flex gap-4 group/item"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-info/10 flex items-center justify-center shrink-0 text-info group-hover/item:scale-110 transition-transform`}
              >
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-black text-lg text-foreground mb-1">
                  Modern Pedagogy
                </h3>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
                  Digital & Smart Classes
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection
              direction="up"
              delay={0.2}
              className="flex gap-4 group/item"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center shrink-0 text-success group-hover/item:scale-110 transition-transform`}
              >
                <Users className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-black text-lg text-foreground mb-1">
                  Expert Educators
                </h3>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
                  Certified Faculty Members
                </p>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection direction="up" delay={0.3}>
            <Button
              asChild
              size="xl"
              className="rounded-full shadow-2xl hover:scale-105 transition-all text-lg font-bold"
            >
              <Link href="/about" className="flex items-center gap-3">
                Discover Our Story <ArrowRight className="w-6 h-6" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </div>
    </div>
  </section>
);
