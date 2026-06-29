import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PerspectiveText from '../components/PerspectiveText';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const leftCol = leftColRef.current;
    if (!section || !leftCol) return;

    const elements = leftCol.querySelectorAll('.animate-in');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' },
    });
    tl.fromTo(elements, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' });
    return () => { tl.kill(); };
  }, []);

  return (
    <section ref={sectionRef} id="about" style={{ padding: '120px 48px', backgroundColor: '#FAF8F5' }}>
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-16">
        <div ref={leftColRef} className="w-full md:w-[45%]">
          <p className="section-label mb-4 animate-in" style={{ color: '#8B9D83' }}>ABOUT</p>
          <h2 className="text-[48px] font-bold leading-[1.15] tracking-[-0.02em] animate-in" style={{ color: '#2D2D2D' }}>
            27+ Years of{' '}<span className="accent-italic text-terracotta">Dedicated</span>{' '}Service
          </h2>
          <p className="text-lg font-normal leading-[1.7] max-w-[480px] mt-6 animate-in" style={{ color: '#4A5568' }}>
            Experienced School Principal with over 15+ years of leadership in State Board, ICSE, and CBSE institutions. Proven expertise in academic administration, faculty development, curriculum implementation, strategic planning, student achievement, and institutional growth.
          </p>
          <p className="text-lg font-normal leading-[1.7] max-w-[480px] mt-4 animate-in" style={{ color: '#4A5568' }}>
            Recognized for building high-performing educational environments, strengthening stakeholder relationships, and driving continuous improvement across diverse school systems. My journey across Tamil Nadu has shaped my belief that every classroom is a promise, and every student a future.
          </p>
        </div>
        <div className="w-full md:w-[55%] flex items-center">
          <PerspectiveText text="Education is not just about academic excellence — it is about nurturing character, building confidence, and inspiring every child to reach their fullest potential. Every classroom is a promise, every student a future." />
        </div>
      </div>
    </section>
  );
}
