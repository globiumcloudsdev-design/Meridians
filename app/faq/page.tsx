"use client";
import { Navbar } from "@/components/Navbar";
import { PageHero } from "@/components/PageHero";
import { Footer } from "@/components/Footer";
import FAQSection from "@/components/faq/faqSection";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SectionHeader } from "@/components/SectionHeader";
import { FinalCTA } from "@/components/FinalCTA";
import { getCurrentAcademicSession } from "@/lib/utils";
import homeImage1 from "@/assets/home/home images/home-1.jpeg";

export default function MeridiansChatbotPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <PageHero
        badge="Help Center"
        titleMain="Frequently"
        titleAccent="Asked Questions"
        image={homeImage1}
        description="Find answers to common questions about our programs, admissions, facilities, and more."
      />

      
          <FAQSection />
      

      

      <Footer />
    </div>
  );
}
