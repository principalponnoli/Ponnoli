import { useEffect, useRef, useState } from 'react';
import PortraitReveal from '../components/PortraitReveal';
import gsap from 'gsap';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.15 });

    if (nameRef.current) {
      tl.fromTo(nameRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, 0);
    }
    if (subtitleRef.current) {
      tl.fromTo(subtitleRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.25);
    }
    if (ctaRef.current) {
      tl.fromTo(ctaRef.current.children, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.12 }, 0.4);
    }
    if (portraitRef.current) {
      tl.fromTo(portraitRef.current, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 1.0, ease: 'power3.out' }, 0.35);
    }

    setIsLoaded(true);
    return () => { tl.kill(); };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      if (portraitRef.current) {
        portraitRef.current.style.transform = `translate(${x * -10}px, ${y * -8}px)`;
      }
    };
    section.addEventListener('mousemove', handleMouseMove);
    return () => section.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToContact = () => {
    const el = document.querySelector('#contact');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full overflow-hidden"
      style={{
        minHeight: '100dvh',
        background: 'radial-gradient(ellipse at 65% 45%, #FAF8F5 0%, #F5F0EB 50%, #EDE7E0 100%)',
      }}
    >
      {/* Soft warm glow behind portrait */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '40%',
          right: '10%',
          transform: 'translateY(-50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(196,114,90,0.10) 0%, rgba(139,157,131,0.05) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center min-h-[100dvh] max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16 gap-8 md:gap-4">

        {/* Left Column — Name & Info */}
        <div className="relative w-full md:w-[55%] flex flex-col justify-center pt-24 md:pt-0 text-center md:text-left">
          
          {/* Name — fills the white space */}
          <h1
            ref={nameRef}
            className="font-bold tracking-[-0.03em] leading-[0.95] opacity-0"
            style={{
              color: '#2D2D2D',
              fontSize: 'clamp(48px, 10vw, 120px)',
            }}
          >
            S. Ponnoli
          </h1>

          {/* Divider line */}
          <div className="w-16 h-px mx-auto md:mx-0 mt-6" style={{ backgroundColor: 'rgba(196,114,90,0.35)' }} />

          {/* Subtitle */}
          <div ref={subtitleRef} className="mt-5 opacity-0">
            <p
              className="text-xl md:text-2xl font-normal tracking-wide"
              style={{ color: '#4A5568' }}
            >
              Educator & Principal
            </p>
          </div>

          {/* Tagline */}
          <p
            className="text-sm font-medium uppercase tracking-[0.12em] mt-3"
            style={{ color: 'rgba(196, 114, 90, 0.8)' }}
          >
            27+ Years in Education
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
            <button
              onClick={scrollToContact}
              className="px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: '#C4725A', borderRadius: '6px' }}
            >
              Get in Touch
            </button>
            <a
              href={`${import.meta.env.BASE_URL}S_Ponnoli_EResume.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="px-8 py-3.5 text-sm font-medium transition-all duration-300 hover:bg-charcoal/5"
              style={{
                color: '#2D2D2D',
                border: '1px solid rgba(45,45,45,0.15)',
                borderRadius: '6px',
              }}
            >
              Download CV
            </a>
          </div>
        </div>

        {/* Right Column — Circular Portrait */}
        <div
          ref={portraitRef}
          className="relative w-full md:w-[45%] flex items-center justify-center md:justify-end pb-12 md:pb-0 opacity-0"
          style={{ transition: 'transform 0.4s ease-out' }}
        >
          {/* Soft glow */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: 'min(280px, 70vw)',
              height: 'min(280px, 70vw)',
              background: 'radial-gradient(circle, rgba(196,114,90,0.18) 0%, transparent 65%)',
              filter: 'blur(40px)',
            }}
          />

          {/* Circle portrait container */}
          <div
            className="relative"
            style={{
              width: 'min(280px, 65vw)',
              height: 'min(280px, 65vw)',
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.12), 0 0 30px rgba(196,114,90,0.08)',
            }}
          >
            {isLoaded && (
              <PortraitReveal
                imageSrc={`${import.meta.env.BASE_URL}portrait.jpg`}
                revealColor="#8B9D83"
                className="w-full h-full"
                style={{
                  aspectRatio: '1/1',
                  borderRadius: '50%',
                } as React.CSSProperties}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
