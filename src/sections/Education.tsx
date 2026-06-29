import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const educationItems = [
  { degree: 'M.Phil', field: 'Postgraduate Research' },
  { degree: 'Masters in English', field: 'Advanced Literature & Linguistics' },
  { degree: 'B.Ed', field: 'Bachelor of Education' },
  { degree: 'Masters in Commerce', field: 'Business & Economics' },
];

export default function Education() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const items = section.querySelectorAll('.edu-item');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' },
    });
    tl.fromTo(items, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: 'power3.out' });
    return () => { tl.kill(); };
  }, []);

  return (
    <section ref={sectionRef} id="education" style={{ padding: '120px 48px', backgroundColor: '#FAF8F5' }}>
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-16">
          <p className="section-label" style={{ color: '#8B9D83' }}>EDUCATION</p>
          <h2 className="text-[48px] font-bold mt-3 tracking-[-0.02em]" style={{ color: '#2D2D2D' }}>
            Academic <span className="accent-italic text-terracotta">Qualifications</span>
          </h2>
        </div>

        <div>
          {educationItems.map((item, index) => (
            <div
              key={index}
              className="edu-item flex items-center justify-between py-7 border-t"
              style={{ borderColor: 'rgba(45,45,45,0.08)' }}
            >
              <div>
                <h3 className="text-[22px] font-bold" style={{ color: '#2D2D2D' }}>{item.degree}</h3>
                <p className="text-sm font-normal mt-1" style={{ color: '#4A5568' }}>{item.field}</p>
              </div>
              <span className="px-3.5 py-1.5 rounded text-[13px] font-medium" style={{ backgroundColor: 'rgba(139,157,131,0.1)', color: '#6B7F5F' }}>
                Completed
              </span>
            </div>
          ))}
          <div className="border-t" style={{ borderColor: 'rgba(45,45,45,0.08)' }} />
        </div>
      </div>
    </section>
  );
}
