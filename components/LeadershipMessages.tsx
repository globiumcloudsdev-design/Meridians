import { AnimatedSection } from "@/components/AnimatedSection";
import { SectionHeader } from "@/components/SectionHeader";
import { aboutAssets } from "@/lib/assets";
import { getImageSrc } from "@/lib/utils";

const leadershipMessages = [
  {
    label: "Message by Administrator Meridians",
    name: "Maam Anum Ilyas",
    role: "Administrator",
    image: getImageSrc(aboutAssets["Our Inspirations"][0]),
    headingClassName: "text-emerald-800",
    body: "Quality education of youth is always at the heart of every progressive civil society. As administrator of Meridian's, I take immense pride in an environment that addresses diverse educational needs and builds strong admissions, collaborative programs, and innovative learning methods for every child.",
  },
  {
    label: "Message by Senior Managing Director of Main Campus",
    name: "Sir Muhammad",
    role: "Managing Director",
    image: getImageSrc(aboutAssets["Our Inspirations"][1]),
    headingClassName: "text-blue-900",
    body: "We foster our students' love for learning, encourage them to try new and exciting things, and give them a solid foundation to build on.",
  },
  {
    label: "Message by Principal Main Campus",
    name: "Maam Tahira",
    role: "Principal",
    image: getImageSrc(aboutAssets["Our Inspirations"][0]),
    headingClassName: "text-amber-700",
    body: "Welcome to Meridian's Group of Education. We are committed to positive students, collaborative staff culture, professional practice, and innovative learning so every child can become a confident leader of the future.",
  },
] as const;

export function LeadershipMessages() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Messages"
          titleAccent="From Leadership"
          description="Guidance from the people shaping Meridians with vision, purpose, and care."
          align="center"
        />

        <div className="mt-14 space-y-6">
          {leadershipMessages.map((message, idx) => (
            <AnimatedSection direction="up" delay={idx * 0.08} key={message.label}>
              <article className="rounded-[28px] border border-primary/15 bg-white/85 backdrop-blur-sm shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-[180px_1fr]">
                  <div className="relative min-h-[190px] md:min-h-full bg-muted/30">
                    <img
                      src={message.image}
                      alt={`${message.name} portrait`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-6 md:p-8">
                    <p
                      className={`text-xl md:text-3xl font-black uppercase tracking-tight leading-tight ${message.headingClassName}`}
                    >
                      {message.label}
                    </p>
                    <p className="mt-1 text-xs md:text-sm uppercase tracking-[0.2em] text-primary/70 font-bold">
                      {message.name} • {message.role}
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-foreground/85">
                      {message.body}
                    </p>
                  </div>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
