import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { number: 27, suffix: '+', label: 'Years in Education' },
  { number: 100, suffix: '%', label: 'Student Pass Results' },
  { number: 5, suffix: '', label: 'Institutions Led' },
];

export default function Achievements() {
  const sectionRef = useRef<HTMLElement>(null);
  const numbersRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const labels = section.querySelectorAll('.stat-label');
    const numbers = numbersRef.current;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' },
    });

    numbers.forEach((numEl, index) => {
      const target = stats[index].number;
      const obj = { value: 0 };
      tl.to(obj, { value: target, duration: 1.5, ease: 'power2.out', onUpdate: () => { numEl.textContent = Math.round(obj.value) + stats[index].suffix; } }, 0);
    });

    tl.fromTo(labels, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0);
    return () => { tl.kill(); };
  }, []);

  return (
    <section ref={sectionRef} style={{ padding: '100px 48px', backgroundColor: '#F5F0EB' }}>
      <div className="max-w-[900px] mx-auto flex flex-col md:flex-row justify-center items-center gap-10 md:gap-20">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="w-10 h-0.5 mx-auto mb-3" style={{ backgroundColor: '#C4725A' }} />
            <span ref={(el) => { if (el) numbersRef.current[index] = el; }} className="text-[56px] font-bold leading-none tracking-[-0.02em]" style={{ color: '#2D2D2D' }}>
              0{stat.suffix}
            </span>
            <p className="stat-label text-sm font-medium uppercase tracking-[0.06em] mt-2 opacity-0" style={{ color: '#4A5568' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
