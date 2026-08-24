"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  BookOpen,
  ChevronDown,
  Check,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

interface Course {
  id: string;
  name: string;
  level: string;
  age: string;
  duration: string;
  format: string;
  desc: string;
  syllabus: string[];
  feeFrom: string;
}

const COURSES: Course[] = [
  {
    id: "noorani",
    name: "Noorani Qaida / Beginners Course",
    level: "Beginner",
    age: "4+ years",
    duration: "2–3 months",
    format: "1-on-1 Online",
    desc: "The fundamental course for beginners to learn Arabic alphabets and basic pronunciation.",
    syllabus: [
      "Arabic letters & their correct shapes",
      "Joining letters into words",
      "Harakat: Zabar, Zair, Paish",
      "Tashdeed, Sukoon, Madd, Tanween",
    ],
    feeFrom: "PKR 3,000/mo",
  },
  {
    id: "nazra",
    name: "Nazra Quran with Basic Tajweed",
    level: "Beginner–Intermediate",
    age: "6+ years",
    duration: "6–12 months",
    format: "1-on-1 Online",
    desc: "Learn to recite the Holy Quran fluently while applying the basic rules of Tajweed.",
    syllabus: [
      "Fluent Quran reading, cover to cover",
      "Basic Tajweed rules applied while reading",
      "Correct Makharij (points of articulation)",
      "Weekly revision & progress tracking",
    ],
    feeFrom: "PKR 3,000/mo",
  },
  {
    id: "hifz",
    name: "Hifz-ul-Quran Memorization",
    level: "Intermediate–Advanced",
    age: "7+ years",
    duration: "2–4 years (self-paced)",
    format: "1-on-1 Online",
    desc: "Memorize the Holy Quran with proper pronunciation and structured guidance from expert teachers.",
    syllabus: [
      "Daily Sabaq (new lesson) & Sabqi (recent revision)",
      "Manzil (long-term revision) scheduling",
      "Memorization aids & repetition techniques",
      "Monthly Hifz progress report",
    ],
    feeFrom: "PKR 4,000/mo",
  },
  {
    id: "tafseer",
    name: "Quran Translation & Tafseer Course",
    level: "Advanced",
    age: "Teens & Adults",
    duration: "6–12 months",
    format: "1-on-1 Online",
    desc: "Understand the deep meaning, context, and translation of the Quranic verses.",
    syllabus: [
      "Word-by-word translation",
      "Context of revelation (Asbab al-Nuzul)",
      "Selected Surah tafseer",
      "Practical life application of verses",
    ],
    feeFrom: "PKR 4,000/mo",
  },
  {
    id: "fahm",
    name: "Short Fahm-e-Deen Course",
    level: "All levels",
    age: "All ages",
    duration: "4–6 weeks",
    format: "1-on-1 Online",
    desc: "Basic Tajweed, brief translation & Tafseer, selected Ahadith, basic rulings (Masail), and short Seerah.",
    syllabus: [
      "Overview of core Tajweed rules",
      "Selected Ahadith with translation",
      "Everyday Fiqh / Masail basics",
      "Short Seerah of the Prophet ﷺ",
    ],
    feeFrom: "PKR 3,000/mo",
  },
  {
    id: "namaz",
    name: "Namaz Course",
    level: "Beginner",
    age: "5+ years",
    duration: "3–4 weeks",
    format: "1-on-1 Online",
    desc: "Learn the complete method of Namaz (Salah), covering all basic rules, problems, and essential Duas.",
    syllabus: [
      "Wudu — steps & conditions",
      "Salah positions & correct recitation",
      "Essential Duas after Salah",
      "Common mistakes corrected",
    ],
    feeFrom: "PKR 3,000/mo",
  },
  {
    id: "nahw",
    name: "Quranic Arabic Grammar — Nahw & Sarf",
    level: "Advanced",
    age: "Teens & Adults",
    duration: "6 months",
    format: "1-on-1 Online",
    desc: "Build the grammar foundation needed to understand the Quran directly in Arabic.",
    syllabus: [
      "Ism, Fi'l & Harf basics",
      "Sentence structure (Nahw)",
      "Word patterns & derivation (Sarf)",
      "Applied grammar on Quranic verses",
    ],
    feeFrom: "PKR 4,000/mo",
  },
  {
    id: "tajweed",
    name: "Tajweed Course",
    level: "Intermediate–Advanced",
    age: "10+ years",
    duration: "3–6 months",
    format: "1-on-1 Online",
    desc: "Learn proper Quranic pronunciation and recitation with a structured, rule-by-rule approach.",
    syllabus: [
      "Makharij-ul-Huroof in depth",
      "Rules of Noon & Meem Saakin",
      "Madd rules & Waqf (stop) signs",
      "Voice beautification & Tarteel",
    ],
    feeFrom: "PKR 4,000/mo",
  },
  {
    id: "fiqh",
    name: "Fiqh Basics with Salah and Kalma",
    level: "Beginner",
    age: "5+ years",
    duration: "4 weeks",
    format: "1-on-1 Online",
    desc: "Learn the six Kalmas, essential Fiqh rulings, and the fundamentals of Salah.",
    syllabus: [
      "Six Kalmas with meaning",
      "Basic Fiqh rulings (Taharah, Salah)",
      "Halal / Haram essentials",
      "Q&A with tutor each session",
    ],
    feeFrom: "PKR 3,000/mo",
  },
  {
    id: "seerah",
    name: "Seerah & Hadith for Children",
    level: "Kids",
    age: "5–12 years",
    duration: "6–8 weeks",
    format: "1-on-1 Online",
    desc: "Stories from the life of Prophet Muhammad ﷺ and easy Hadith, designed to build character in children.",
    syllabus: [
      "Life of the Prophet ﷺ in simple stories",
      "Selected easy Hadith with morals",
      "Character & akhlaq building activities",
      "Fun quizzes & revision games",
    ],
    feeFrom: "PKR 3,000/mo",
  },
];

const FEE_PLANS = {
  PKR: [
    { freq: "2 Classes / Week", total: "8 classes / month", price: "PKR 3,000", popular: false },
    { freq: "3 Classes / Week", total: "12 classes / month", price: "PKR 4,000", popular: true },
    { freq: "4 Classes / Week", total: "16 classes / month", price: "PKR 5,000", popular: false },
    { freq: "5 Classes / Week", total: "20 classes / month", price: "PKR 6,000", popular: false },
  ],
  USD: [
    { freq: "2 Classes / Week", total: "8 classes / month", price: "$25", popular: false },
    { freq: "3 Classes / Week", total: "12 classes / month", price: "$35", popular: true },
    { freq: "4 Classes / Week", total: "16 classes / month", price: "$45", popular: false },
    { freq: "5 Classes / Week", total: "20 classes / month", price: "$55", popular: false },
  ],
};

const PKR_BY_FREQ: Record<string, string> = {
  "2": "PKR 3,000",
  "3": "PKR 4,000",
  "4": "PKR 5,000",
  "5": "PKR 6,000",
};

const USD_BY_FREQ: Record<string, string> = {
  "2": "$25",
  "3": "$35",
  "4": "$45",
  "5": "$55",
};

export default function OnlineQuranPage() {
  const [currency, setCurrency] = useState<"PKR" | "USD">("PKR");
  const [openSyllabus, setOpenSyllabus] = useState<Record<string, boolean>>({});
  const [refId, setRefId] = useState("MQA-000000");

  // Form State
  const [studentName, setStudentName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [country, setCountry] = useState("");
  const [level, setLevel] = useState("New to Quran / Arabic alphabet");
  const [guardianName, setGuardianName] = useState("");
  const [relation, setRelation] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0].name);
  const [freq, setFreq] = useState("3");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Mon", "Wed", "Fri"]);
  const [prefTime, setPrefTime] = useState("");
  const [timezone, setTimezone] = useState("");
  const [tutor, setTutor] = useState("No preference");
  const [platform, setPlatform] = useState("Zoom");
  const [notes, setNotes] = useState("");
  const [agree, setAgree] = useState(false);

  // Validation & Submission States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const randomRef = "MQA-" + Math.floor(100000 + Math.random() * 900000);
    setRefId(randomRef);
  }, []);

  const toggleSyllabus = (courseId: string) => {
    setOpenSyllabus((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  const handleSelectCourseAndScroll = (courseName: string) => {
    setSelectedCourse(courseName);
    const enrollElement = document.getElementById("enroll");
    if (enrollElement) {
      enrollElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!studentName.trim()) {
      newErrors.studentName = "Please enter the student's name.";
    }

    if (!age || Number(age) < 3 || Number(age) > 90) {
      newErrors.age = "Please enter a valid age (3–90).";
    }

    if (!country.trim()) {
      newErrors.country = "Please enter your location.";
    }

    if (!whatsapp.trim() || whatsapp.replace(/\D/g, "").length < 7) {
      newErrors.whatsapp = "WhatsApp number is required for trial confirmation.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = "A valid email address is required.";
    }

    if (!selectedCourse) {
      newErrors.course = "Please select a course.";
    }

    if (!agree) {
      newErrors.agree = "Please agree to the trial and contact terms.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const estimatedFeeNumeric =
        currency === "USD"
          ? freq === "2"
            ? 25
            : freq === "3"
            ? 35
            : freq === "4"
            ? 45
            : 55
          : freq === "2"
          ? 3000
          : freq === "3"
          ? 4000
          : freq === "4"
          ? 5000
          : 6000;

      // Save enrollment inquiry to Admission Queries
      await fetch("/api/admission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          queryType: "online_quran",
          name: studentName,
          age: age,
          gender: gender,
          class: selectedCourse,
          homeAddress: country,
          quranLevel: level,
          fatherName: guardianName,
          relation: relation,
          contact1: whatsapp.startsWith("+92") ? whatsapp : `+92 ${whatsapp}`,
          parentEmail: email,
          program: "Online Quran",
          shift: `${freq} Classes / Week`,
          classesPerWeek: freq,
          feeAmount: estimatedFeeNumeric,
          currency: currency,
          preferredDays: selectedDays,
          preferredTime: prefTime,
          timezone: timezone,
          preferredTutor: tutor,
          preferredPlatform: platform,
          message: notes,
          admissionNo: refId,
          status: "pending",
        }),
      });
    } catch (err) {
      console.error("Error submitting Quran admission query:", err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      const enrollElement = document.getElementById("enroll");
      if (enrollElement) {
        enrollElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setErrors({});
    const newRef = "MQA-" + Math.floor(100000 + Math.random() * 900000);
    setRefId(newRef);
    setStudentName("");
    setAge("");
    setGender("Male");
    setCountry("");
    setLevel("New to Quran / Arabic alphabet");
    setGuardianName("");
    setRelation("");
    setWhatsapp("");
    setEmail("");
    setSelectedCourse(COURSES[0].name);
    setFreq("3");
    setSelectedDays(["Mon", "Wed", "Fri"]);
    setPrefTime("");
    setTimezone("");
    setTutor("No preference");
    setPlatform("Zoom");
    setNotes("");
    setAgree(false);
  };

  const currentEstimatedFee =
    currency === "USD"
      ? `${USD_BY_FREQ[freq]} /month`
      : `${PKR_BY_FREQ[freq]} /month`;

  const whatsappMessage = encodeURIComponent(
    `Assalam-o-Alaikum! I have submitted an enrollment request for Online Quran Academy (Reference: ${refId}). Student: ${studentName}, Course: ${selectedCourse}. Please confirm our free trial session.`
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F6F7] text-[#12161C] font-sans antialiased selection:bg-[#0F9488]/20 selection:text-[#0B6E64]">
      <Navbar />

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-24 bg-gradient-to-b from-[#12161C] via-[#171f28] to-[#1b232d] text-white text-center px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-block bg-[#0F9488]/20 border border-[#0F9488]/40 text-[#5FD0C1] text-xs font-bold tracking-[1.4px] uppercase px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            Meridian&apos;s Online Quran Academy
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15] max-w-3xl mx-auto">
            Learn Quran online with{" "}
            <em className="text-[#D8A868] not-italic italic font-serif">
              qualified male &amp; female tutors
            </em>
          </h1>

          <p className="max-w-2xl mx-auto mt-5 text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            One-to-one live classes in Tajweed, Nazra, Hifz, Tafseer and Islamic
            studies — taught from Meridian&apos;s, wherever you are in the world.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
            <a
              href="#enroll"
              className="inline-flex items-center gap-2 bg-[#0F9488] hover:bg-[#0B6E64] text-white text-sm sm:text-base font-bold py-3.5 px-7 rounded-full shadow-lg shadow-teal-900/30 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Enroll Now <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#courses"
              className="inline-flex items-center gap-2 bg-transparent border border-white/30 hover:border-white text-white text-sm sm:text-base font-bold py-3.5 px-7 rounded-full transition-all duration-200"
            >
              Browse Courses
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- STATS SECTION ---------------- */}
      <section className="bg-white border-y border-[#E3E7EA] py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-2">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#0B6E64] font-serif">
                10+
              </span>
              <span className="text-xs sm:text-sm text-[#4B5563] font-semibold tracking-wide mt-1 block">
                Course Programs
              </span>
            </div>
            <div className="p-2">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#0B6E64] font-serif">
                20+
              </span>
              <span className="text-xs sm:text-sm text-[#4B5563] font-semibold tracking-wide mt-1 block">
                Certified Tutors
              </span>
            </div>
            <div className="p-2">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#0B6E64] font-serif">
                500+
              </span>
              <span className="text-xs sm:text-sm text-[#4B5563] font-semibold tracking-wide mt-1 block">
                Students Taught
              </span>
            </div>
            <div className="p-2">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#0B6E64] font-serif">
                5 Days
              </span>
              <span className="text-xs sm:text-sm text-[#4B5563] font-semibold tracking-wide mt-1 block">
                Classes / Week
              </span>
            </div>
          </div>
          <div className="text-center text-xs text-[#6B7280] mt-4 pt-3 border-t border-dashed border-slate-200">
            Dedicated one-on-one sessions for learners of all ages worldwide.
          </div>
        </div>
      </section>

      {/* ---------------- COURSES SECTION ---------------- */}
      <section id="courses" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block bg-[#E6F4F2] text-[#0B6E64] text-[11px] font-bold tracking-[1.2px] uppercase px-3.5 py-1.5 rounded-full mb-3">
              Course Outlines
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12161C] tracking-tight">
              Our Core{" "}
              <span className="text-[#0F9488] italic font-serif">Courses</span>
            </h2>
            <p className="mt-3 text-[#4B5563] text-sm sm:text-base leading-relaxed">
              Comprehensive learning paths designed to build a strong foundation
              in Quranic and Islamic education — for every age and level.
            </p>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.map((course) => {
              const isOpen = !!openSyllabus[course.id];
              return (
                <div
                  key={course.id}
                  className="bg-white border border-[#E3E7EA] rounded-[16px] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-11 h-11 rounded-xl bg-[#E6F4F2] text-[#0B6E64] flex items-center justify-center mb-4">
                      <BookOpen className="w-5 h-5 text-[#0F9488]" />
                    </div>

                    <h3 className="text-lg font-bold text-[#12161C] leading-snug">
                      {course.name}
                    </h3>

                    <div className="flex flex-wrap gap-1.5 my-3">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#E6F4F2] text-[#0B6E64]">
                        {course.level}
                      </span>
                      <span className="text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#F0F2F4] text-[#4B5563]">
                        {course.age}
                      </span>
                      <span className="text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#F0F2F4] text-[#4B5563]">
                        {course.duration}
                      </span>
                    </div>

                    <p className="text-sm text-[#4B5563] leading-relaxed mb-4">
                      {course.desc}
                    </p>

                    {/* Accordion Syllabus */}
                    {isOpen && (
                      <div className="mt-3 pt-3 border-t border-dashed border-[#E3E7EA] text-xs text-[#4B5563] animate-in fade-in-50 duration-200">
                        <b className="text-[#12161C] block mb-2 font-semibold">
                          What you&apos;ll learn:
                        </b>
                        <ul className="space-y-1.5 pl-4 list-disc marker:text-[#0F9488]">
                          {course.syllabus.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-dashed border-[#E3E7EA]">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-[#12161C] block">
                          {course.feeFrom}
                        </span>
                        <small className="text-[10.5px] text-[#6B7280]">
                          starting fee
                        </small>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleSyllabus(course.id)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#0B6E64] hover:text-[#0F9488] transition-colors cursor-pointer"
                      >
                        {isOpen ? "Hide" : "Details"}
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectCourseAndScroll(course.name)}
                      className="w-full mt-3.5 py-2.5 px-4 bg-[#12161C] hover:bg-[#1f2630] text-white text-center text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      Enroll in this course
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="max-w-2xl mx-auto mt-10 text-center text-xs text-[#4B5563] bg-[#FAFAF9] border border-dashed border-[#E3E7EA] rounded-xl p-4">
            Fees shown are starting estimates for the lowest class-frequency
            plan. See{" "}
            <a
              href="#fees"
              className="text-[#0B6E64] font-bold hover:underline"
            >
              Fee Plans
            </a>{" "}
            below for the full breakdown by weekly frequency.
          </div>
        </div>
      </section>

      {/* ---------------- FEE PLANS SECTION ---------------- */}
      <section
        id="fees"
        className="py-16 md:py-24 bg-white border-y border-[#E3E7EA]"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-block bg-[#E6F4F2] text-[#0B6E64] text-[11px] font-bold tracking-[1.2px] uppercase px-3.5 py-1.5 rounded-full mb-3">
              Investment
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12161C] tracking-tight">
              Flexible Study Plans &amp;{" "}
              <span className="text-[#0F9488] italic font-serif">Fees</span>
            </h2>
            <p className="mt-3 text-[#4B5563] text-sm sm:text-base leading-relaxed">
              All plans include 1-on-1 personalized classes, choice of tutor,
              and a monthly progress report. Choose the weekly frequency that
              fits your schedule.
            </p>
          </div>

          {/* Currency Switcher */}
          <div className="flex justify-center gap-2 mb-8">
            <button
              type="button"
              onClick={() => setCurrency("PKR")}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                currency === "PKR"
                  ? "bg-[#12161C] text-white shadow-sm"
                  : "bg-white border border-[#E3E7EA] text-[#4B5563] hover:border-slate-400"
              }`}
            >
              PKR Plan (Pakistan)
            </button>
            <button
              type="button"
              onClick={() => setCurrency("USD")}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                currency === "USD"
                  ? "bg-[#12161C] text-white shadow-sm"
                  : "bg-white border border-[#E3E7EA] text-[#4B5563] hover:border-slate-400"
              }`}
            >
              USD Plan (International)
            </button>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEE_PLANS[currency].map((plan, idx) => (
              <div
                key={idx}
                className={`relative bg-white border rounded-[16px] p-6 text-center flex flex-col justify-between transition-all duration-300 ${
                  plan.popular
                    ? "border-[#0F9488] ring-2 ring-[#0F9488]/20 shadow-md scale-[1.02]"
                    : "border-[#E3E7EA] shadow-sm hover:shadow-md"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0F9488] text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="text-sm font-bold text-[#4B5563]">
                    {plan.freq}
                  </div>
                  <div className="text-3xl font-extrabold text-[#12161C] my-2 font-serif">
                    {plan.price}
                    <span className="text-xs text-[#6B7280] font-sans font-normal ml-1">
                      /mo
                    </span>
                  </div>
                  <div className="text-xs text-[#0B6E64] font-bold mb-5">
                    Total {plan.total}
                  </div>

                  <ul className="text-left text-xs text-[#4B5563] space-y-2.5 mb-6 border-t border-dashed border-[#E3E7EA] pt-4">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#0F9488] shrink-0 stroke-[3]" />
                      <span>1-on-1 personalized classes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#0F9488] shrink-0 stroke-[3]" />
                      <span>30-minute session duration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#0F9488] shrink-0 stroke-[3]" />
                      <span>Choice of preferred tutor</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#0F9488] shrink-0 stroke-[3]" />
                      <span>Monthly progress report</span>
                    </li>
                  </ul>
                </div>

                <a
                  href="#enroll"
                  className="w-full py-2.5 bg-[#0F9488] hover:bg-[#0B6E64] text-white font-bold text-xs sm:text-sm rounded-lg transition-colors text-center inline-block"
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>

          <div className="text-center text-xs text-[#4B5563] mt-8">
            All new students start with a <b>free trial class</b> before their
            first paid month. Fees are billed monthly in advance — see{" "}
            <a
              href="#enroll"
              className="text-[#0B6E64] font-bold hover:underline"
            >
              Payment Options
            </a>{" "}
            at enrollment.
          </div>
        </div>
      </section>

      {/* ---------------- ENROLL FORM SECTION ---------------- */}
      <section id="enroll" className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-block bg-[#E6F4F2] text-[#0B6E64] text-[11px] font-bold tracking-[1.2px] uppercase px-3.5 py-1.5 rounded-full mb-3">
              Get Started
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12161C] tracking-tight">
              Enroll Now —{" "}
              <span className="text-[#0F9488] italic font-serif">
                Free Trial
              </span>
            </h2>
            <p className="mt-3 text-[#4B5563] text-sm sm:text-base leading-relaxed">
              Fill out the form below and our team will confirm your free trial
              class within 24 hours via WhatsApp or email.
            </p>
          </div>

          {/* Form Shell */}
          <div className="bg-white border border-[#E3E7EA] rounded-[20px] shadow-lg overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-[#12161C] to-[#1c2733] text-white p-6 sm:p-8">
              <div className="inline-block bg-white/10 border border-white/20 text-[#5FD0C1] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                Application reference:{" "}
                <span className="font-mono text-white">{refId}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold">
                Online Quran Class — Enrollment Form
              </h3>
              <p className="mt-1 text-slate-300 text-xs sm:text-sm">
                Takes about 3 minutes. You can start with a free trial before
                committing to a monthly plan.
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-8 space-y-8">
                {/* 1. Student Information */}
                <fieldset className="space-y-4">
                  <legend className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#0B6E64] pb-2 border-b border-[#E3E7EA] w-full mb-4">
                    <span className="w-5 h-5 rounded-full bg-[#E6F4F2] text-[#0B6E64] flex items-center justify-center text-[10px] font-mono font-bold">
                      1
                    </span>
                    Student Information
                  </legend>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#12161C]">
                        Student&apos;s full name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. Abdullah Khan"
                        className={`w-full px-3.5 py-2.5 text-sm bg-[#FBFCFD] border rounded-lg outline-none transition-all ${
                          errors.studentName
                            ? "border-red-400 bg-red-50/50 focus:ring-2 focus:ring-red-300"
                            : "border-[#E3E7EA] focus:border-[#0F9488] focus:ring-2 focus:ring-[#0F9488]/15"
                        }`}
                      />
                      {errors.studentName && (
                        <span className="text-[11px] text-red-500 font-medium">
                          {errors.studentName}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#12161C]">
                        Age <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="3"
                        max="90"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="e.g. 9"
                        className={`w-full px-3.5 py-2.5 text-sm bg-[#FBFCFD] border rounded-lg outline-none transition-all ${
                          errors.age
                            ? "border-red-400 bg-red-50/50 focus:ring-2 focus:ring-red-300"
                            : "border-[#E3E7EA] focus:border-[#0F9488] focus:ring-2 focus:ring-[#0F9488]/15"
                        }`}
                      />
                      {errors.age && (
                        <span className="text-[11px] text-red-500 font-medium">
                          {errors.age}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#12161C]">
                        Gender
                      </label>
                      <div className="flex gap-2">
                        {["Male", "Female"].map((g) => (
                          <label
                            key={g}
                            className={`flex-1 py-2 px-3 border rounded-lg text-xs font-bold cursor-pointer text-center transition-all ${
                              gender === g
                                ? "border-[#0F9488] bg-[#E6F4F2] text-[#0B6E64]"
                                : "border-[#E3E7EA] bg-white text-[#4B5563] hover:border-slate-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="gender"
                              value={g}
                              checked={gender === g}
                              onChange={() => setGender(g)}
                              className="hidden"
                            />
                            {g}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#12161C]">
                        Country / city <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="e.g. Lahore, Pakistan"
                        className={`w-full px-3.5 py-2.5 text-sm bg-[#FBFCFD] border rounded-lg outline-none transition-all ${
                          errors.country
                            ? "border-red-400 bg-red-50/50 focus:ring-2 focus:ring-red-300"
                            : "border-[#E3E7EA] focus:border-[#0F9488] focus:ring-2 focus:ring-[#0F9488]/15"
                        }`}
                      />
                      {errors.country && (
                        <span className="text-[11px] text-red-500 font-medium">
                          {errors.country}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-[#12161C]">
                        Current Quran reading level{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "New to Quran / Arabic alphabet",
                          "Can read, but needs Tajweed correction",
                          "Fluent reciter",
                          "Currently memorizing (Hifz)",
                          "Hafiz — wants advanced course",
                        ].map((lvl) => (
                          <label
                            key={lvl}
                            className={`py-2 px-3 border rounded-full text-xs cursor-pointer transition-all ${
                              level === lvl
                                ? "border-[#0F9488] bg-[#E6F4F2] text-[#0B6E64] font-bold"
                                : "border-[#E3E7EA] bg-white text-[#4B5563] hover:border-slate-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="level"
                              value={lvl}
                              checked={level === lvl}
                              onChange={() => setLevel(lvl)}
                              className="hidden"
                            />
                            {lvl}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </fieldset>

                {/* 2. Parent / Guardian & Contact */}
                <fieldset className="space-y-4">
                  <legend className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#0B6E64] pb-2 border-b border-[#E3E7EA] w-full mb-4">
                    <span className="w-5 h-5 rounded-full bg-[#E6F4F2] text-[#0B6E64] flex items-center justify-center text-[10px] font-mono font-bold">
                      2
                    </span>
                    Parent / Guardian &amp; Contact
                  </legend>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#12161C]">
                        Parent&apos;s / guardian&apos;s name{" "}
                        <span className="text-slate-400 font-normal text-[11px]">
                          (if student is a minor)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={guardianName}
                        onChange={(e) => setGuardianName(e.target.value)}
                        placeholder="e.g. Tariq Khan"
                        className="w-full px-3.5 py-2.5 text-sm bg-[#FBFCFD] border border-[#E3E7EA] rounded-lg outline-none focus:border-[#0F9488] focus:ring-2 focus:ring-[#0F9488]/15 transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#12161C]">
                        Relation to student
                      </label>
                      <input
                        type="text"
                        value={relation}
                        onChange={(e) => setRelation(e.target.value)}
                        placeholder="e.g. Father, Mother"
                        className="w-full px-3.5 py-2.5 text-sm bg-[#FBFCFD] border border-[#E3E7EA] rounded-lg outline-none focus:border-[#0F9488] focus:ring-2 focus:ring-[#0F9488]/15 transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#12161C]">
                        WhatsApp number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <span className="flex items-center justify-center px-3 border border-[#E3E7EA] rounded-lg bg-[#F0F2F5] text-xs font-mono text-[#4B5563]">
                          +92
                        </span>
                        <input
                          type="tel"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          placeholder="3XX-XXXXXXX"
                          maxLength={11}
                          className={`w-full px-3.5 py-2.5 text-sm font-mono bg-[#FBFCFD] border rounded-lg outline-none transition-all ${
                            errors.whatsapp
                              ? "border-red-400 bg-red-50/50 focus:ring-2 focus:ring-red-300"
                              : "border-[#E3E7EA] focus:border-[#0F9488] focus:ring-2 focus:ring-[#0F9488]/15"
                          }`}
                        />
                      </div>
                      {errors.whatsapp && (
                        <span className="text-[11px] text-red-500 font-medium">
                          {errors.whatsapp}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#12161C]">
                        Email address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className={`w-full px-3.5 py-2.5 text-sm bg-[#FBFCFD] border rounded-lg outline-none transition-all ${
                          errors.email
                            ? "border-red-400 bg-red-50/50 focus:ring-2 focus:ring-red-300"
                            : "border-[#E3E7EA] focus:border-[#0F9488] focus:ring-2 focus:ring-[#0F9488]/15"
                        }`}
                      />
                      {errors.email && (
                        <span className="text-[11px] text-red-500 font-medium">
                          {errors.email}
                        </span>
                      )}
                    </div>
                  </div>
                </fieldset>

                {/* 3. Course Selection */}
                <fieldset className="space-y-4">
                  <legend className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#0B6E64] pb-2 border-b border-[#E3E7EA] w-full mb-4">
                    <span className="w-5 h-5 rounded-full bg-[#E6F4F2] text-[#0B6E64] flex items-center justify-center text-[10px] font-mono font-bold">
                      3
                    </span>
                    Course Selection
                  </legend>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {COURSES.map((c) => (
                      <label
                        key={c.id}
                        className={`border rounded-xl p-3.5 flex items-start gap-3 cursor-pointer transition-all ${
                          selectedCourse === c.name
                            ? "border-[#0F9488] bg-[#E6F4F2] ring-1 ring-[#0F9488]"
                            : "border-[#E3E7EA] bg-white hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="coursePick"
                          value={c.name}
                          checked={selectedCourse === c.name}
                          onChange={() => setSelectedCourse(c.name)}
                          className="mt-1 text-[#0F9488] focus:ring-[#0F9488]"
                        />
                        <div>
                          <div className="text-xs font-bold text-[#12161C]">
                            {c.name}
                          </div>
                          <div className="text-[11px] text-[#6B7280] mt-0.5">
                            {c.level} · {c.duration}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.course && (
                    <span className="text-[11px] text-red-500 font-medium">
                      {errors.course}
                    </span>
                  )}
                </fieldset>

                {/* 4. Schedule Preferences */}
                <fieldset className="space-y-4">
                  <legend className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#0B6E64] pb-2 border-b border-[#E3E7EA] w-full mb-4">
                    <span className="w-5 h-5 rounded-full bg-[#E6F4F2] text-[#0B6E64] flex items-center justify-center text-[10px] font-mono font-bold">
                      4
                    </span>
                    Schedule Preferences
                  </legend>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-[#12161C]">
                        Classes per week <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["2", "3", "4", "5"].map((f) => (
                          <label
                            key={f}
                            className={`py-2 px-4 border rounded-full text-xs cursor-pointer font-bold transition-all ${
                              freq === f
                                ? "border-[#0F9488] bg-[#E6F4F2] text-[#0B6E64]"
                                : "border-[#E3E7EA] bg-white text-[#4B5563] hover:border-slate-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="freq"
                              value={f}
                              checked={freq === f}
                              onChange={() => setFreq(f)}
                              className="hidden"
                            />
                            {f} / week
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Estimated Monthly Fee Box */}
                    <div className="sm:col-span-2 bg-[#E6F4F2] border border-dashed border-[#0F9488] rounded-xl p-4 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0B6E64]">
                        Estimated monthly fee ({currency})
                      </span>
                      <span className="text-xl sm:text-2xl font-extrabold text-[#12161C] font-serif">
                        {currentEstimatedFee}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-[#12161C]">
                        Preferred days
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                          (day) => {
                            const isDaySelected = selectedDays.includes(day);
                            return (
                              <button
                                type="button"
                                key={day}
                                onClick={() => toggleDay(day)}
                                className={`w-11 h-11 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  isDaySelected
                                    ? "bg-[#0F9488] text-white shadow-sm"
                                    : "bg-white border border-[#E3E7EA] text-[#4B5563] hover:border-slate-300"
                                }`}
                              >
                                {day}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#12161C]">
                        Preferred time
                      </label>
                      <input
                        type="time"
                        value={prefTime}
                        onChange={(e) => setPrefTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-[#FBFCFD] border border-[#E3E7EA] rounded-lg outline-none focus:border-[#0F9488] focus:ring-2 focus:ring-[#0F9488]/15"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#12161C]">
                        Time zone
                      </label>
                      <input
                        type="text"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        placeholder="e.g. PKT (GMT+5) or BST"
                        className="w-full px-3.5 py-2.5 text-sm bg-[#FBFCFD] border border-[#E3E7EA] rounded-lg outline-none focus:border-[#0F9488] focus:ring-2 focus:ring-[#0F9488]/15"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#12161C]">
                        Preferred tutor
                      </label>
                      <div className="flex gap-2">
                        {["No preference", "Male", "Female"].map((t) => (
                          <label
                            key={t}
                            className={`flex-1 py-2 px-2 border rounded-lg text-xs font-bold cursor-pointer text-center transition-all ${
                              tutor === t
                                ? "border-[#0F9488] bg-[#E6F4F2] text-[#0B6E64]"
                                : "border-[#E3E7EA] bg-white text-[#4B5563] hover:border-slate-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="tutor"
                              value={t}
                              checked={tutor === t}
                              onChange={() => setTutor(t)}
                              className="hidden"
                            />
                            {t}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#12161C]">
                        Preferred platform
                      </label>
                      <select
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-[#FBFCFD] border border-[#E3E7EA] rounded-lg outline-none focus:border-[#0F9488] focus:ring-2 focus:ring-[#0F9488]/15"
                      >
                        <option>Zoom</option>
                        <option>Google Meet</option>
                        <option>Microsoft Teams</option>
                        <option>No preference</option>
                      </select>
                    </div>
                  </div>
                </fieldset>

                {/* 5. Additional Notes */}
                <fieldset className="space-y-4">
                  <legend className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#0B6E64] pb-2 border-b border-[#E3E7EA] w-full mb-4">
                    <span className="w-5 h-5 rounded-full bg-[#E6F4F2] text-[#0B6E64] flex items-center justify-center text-[10px] font-mono font-bold">
                      5
                    </span>
                    Additional Notes{" "}
                    <span className="text-slate-400 font-normal text-[11px] lowercase">
                      (optional)
                    </span>
                  </legend>

                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Anything else we should know — e.g. previous Quran teacher, learning pace, special requirements…"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FBFCFD] border border-[#E3E7EA] rounded-lg outline-none focus:border-[#0F9488] focus:ring-2 focus:ring-[#0F9488]/15 resize-y"
                  />
                </fieldset>

                {/* Consent Checkbox */}
                <div className="space-y-1 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      className="mt-1 w-4 h-4 text-[#0F9488] rounded border-[#E3E7EA] focus:ring-[#0F9488]"
                    />
                    <span className="text-xs text-[#4B5563] leading-relaxed">
                      I&apos;d like to begin with a free trial class and agree to
                      be contacted via WhatsApp, phone, or email to confirm my
                      appointment. <span className="text-red-500">*</span>
                    </span>
                  </label>
                  {errors.agree && (
                    <span className="text-[11px] text-red-500 font-medium block pl-7">
                      {errors.agree}
                    </span>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-[#E3E7EA] flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#12161C] hover:bg-[#1f2630] text-white font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        Submit &amp; Request Free Trial{" "}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Success Screen */
              <div className="p-8 sm:p-12 text-center animate-in fade-in-50 duration-300">
                <div className="w-16 h-16 rounded-full bg-[#E6F4F2] text-[#0F9488] flex items-center justify-center mx-auto mb-5 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-extrabold text-[#12161C]">
                  Trial Request Received!
                </h3>
                <p className="mt-2 text-sm text-[#4B5563] max-w-md mx-auto leading-relaxed">
                  Thank you — our team will WhatsApp or email you within 24
                  hours to confirm your free trial class and share the meeting
                  link.
                </p>

                <div className="inline-block my-6 px-6 py-3 border-2 border-dashed border-[#0F9488] rounded-xl font-mono text-base font-bold bg-[#E6F4F2] text-[#12161C]">
                  {refId}
                </div>

                {/* Summary Box */}
                <div className="max-w-md mx-auto text-left text-xs text-[#4B5563] bg-[#FBFCFD] border border-[#E3E7EA] rounded-xl p-5 mb-8 space-y-2.5">
                  <div className="flex justify-between pb-2 border-b border-dashed border-slate-200">
                    <span>Student:</span>
                    <b className="text-[#12161C]">{studentName}</b>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-dashed border-slate-200">
                    <span>Course:</span>
                    <b className="text-[#12161C]">{selectedCourse}</b>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-dashed border-slate-200">
                    <span>Frequency:</span>
                    <b className="text-[#12161C]">{freq} classes / week</b>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-dashed border-slate-200">
                    <span>Estimated Fee:</span>
                    <b className="text-[#0B6E64] font-bold">
                      {currentEstimatedFee}
                    </b>
                  </div>
                  <div className="flex justify-between">
                    <span>Contact:</span>
                    <b className="text-[#12161C]">{email}</b>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/923033569000?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#0F9488] hover:bg-[#0B6E64] text-white font-bold text-sm py-3 px-6 rounded-xl shadow-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat on WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center gap-2 bg-white border border-[#E3E7EA] hover:border-slate-400 text-[#12161C] font-bold text-sm py-3 px-6 rounded-xl transition-all cursor-pointer"
                  >
                    Submit another enrollment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

