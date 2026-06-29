import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Lightbulb, Wrench, FolderKanban } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  {
    icon: Users,
    name: 'Leadership',
    description: 'Guiding institutions with vision, fostering collaboration among faculty and staff to achieve shared educational goals.',
  },
  {
    icon: Lightbulb,
    name: 'Creativity',
    description: 'Designing innovative teaching methods and engaging learning environments that inspire curiosity and critical thinking.',
  },
  {
    icon: Wrench,
    name: 'Problem Solving',
    description: 'Navigating challenges with strategic thinking and practical solutions that benefit students, faculty, and the institution.',
  },
  {
    icon: FolderKanban,
    name: 'Project Management',
    description: 'Overseeing academic programs, events, and institutional initiatives from planning through successful execution.',
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const cards = section.querySelectorAll('.skill-card');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' },
    });
    tl.fromTo(cards, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.4)' });
    return () => { tl.kill(); };
  }, []);

  return (
    <section ref={sectionRef} id="skills" style={{ padding: '120px 48px', backgroundColor: '#3D4F5F' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <p className="section-label" style={{ color: 'rgba(245,240,235,0.6)' }}>SKILLS</p>
          <h2 className="text-[48px] font-bold mt-3 tracking-[-0.02em]" style={{ color: '#F5F0EB' }}>
            Leadership <span className="accent-italic text-terracotta">Competencies</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <div
                key={index}
                className="skill-card rounded-xl p-8 text-center transition-all duration-300 hover:-translate-y-0.5"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.05)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
                }}
              >
                <Icon size={32} style={{ color: '#F5F0EB' }} className="mx-auto" strokeWidth={1.5} />
                <h3 className="text-lg font-bold mt-4" style={{ color: '#F5F0EB' }}>{skill.name}</h3>
                <p className="text-sm font-normal mt-2 leading-[1.5]" style={{ color: 'rgba(245,240,235,0.6)' }}>{skill.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
