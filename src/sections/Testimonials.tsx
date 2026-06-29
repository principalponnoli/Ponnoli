import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "Her leadership transformed our school's academic culture. Under her guidance, we achieved results we never thought possible. She leads with both wisdom and heart, always putting students first.",
    attribution: "Faculty Member, St. Joseph's Matric School",
  },
  {
    quote: "An administrator who truly understands the needs of both students and teachers. Her problem-solving approach and creative thinking made her an invaluable asset to our institution.",
    attribution: 'Colleague, BMD Jain School',
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const cards = section.querySelectorAll('.testimonial-card');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' },
    });
    tl.fromTo(cards[0], { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, 0);
    if (cards[1]) tl.fromTo(cards[1], { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, 0);
    return () => { tl.kill(); };
  }, []);

  return (
    <section ref={sectionRef} style={{ padding: '120px 48px', backgroundColor: '#1C2A35' }}>
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-16">
          <p className="section-label" style={{ color: 'rgba(245,240,235,0.5)' }}>TESTIMONIALS</p>
          <h2 className="text-[48px] font-bold mt-3 tracking-[-0.02em]" style={{ color: '#F5F0EB' }}>
            Words from the <span className="accent-italic text-terracotta">Community</span>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="testimonial-card relative flex-1 rounded-2xl p-12"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span className="absolute top-6 left-8 font-serif leading-none select-none pointer-events-none" style={{ fontSize: '80px', color: 'rgba(196,114,90,0.15)', fontFamily: 'Georgia, serif' }}>&ldquo;</span>
              <p className="text-lg font-normal italic leading-[1.7] relative z-10" style={{ color: 'rgba(245,240,235,0.85)' }}>{item.quote}</p>
              <p className="text-sm font-medium mt-6 relative z-10" style={{ color: '#F5F0EB' }}>— {item.attribution}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
