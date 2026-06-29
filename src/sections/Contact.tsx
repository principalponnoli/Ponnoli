import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const section = sectionRef.current;
    const leftCol = leftColRef.current;
    const rightCol = rightColRef.current;
    if (!section || !leftCol || !rightCol) return;

    const leftElements = leftCol.querySelectorAll('.animate-in');
    const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' } });
    tl.fromTo(leftElements, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' });
    tl.fromTo(rightCol, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }, 0.2);
    return () => { tl.kill(); };
  }, []);

  useEffect(() => { if (showToast) { const timer = setTimeout(() => setShowToast(false), 4000); return () => clearTimeout(timer); } }, [showToast]);

  const handleSubmit = useCallback((e: React.FormEvent) => { e.preventDefault(); setShowToast(true); setFormData({ name: '', email: '', message: '' }); }, []);

  const inputClasses = 'w-full h-[52px] px-4 rounded-lg text-[15px] font-normal outline-none transition-all duration-200 focus:ring-[3px]';
  const inputStyle: React.CSSProperties = { border: '1px solid rgba(45,45,45,0.1)', fontFamily: "'DM Sans', sans-serif", backgroundColor: '#FFFFFF', color: '#2D2D2D' };
  const inputFocusStyle = { borderColor: '#C4725A', boxShadow: '0 0 0 3px rgba(196,114,90,0.1)' };

  return (
    <section ref={sectionRef} id="contact" style={{ padding: '120px 48px', backgroundColor: '#FAF8F5' }}>
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-16">
        <div ref={leftColRef} className="w-full md:w-1/2">
          <p className="section-label animate-in" style={{ color: '#8B9D83' }}>CONTACT</p>
          <h2 className="text-[48px] font-bold mt-3 tracking-[-0.02em] animate-in" style={{ color: '#2D2D2D' }}>
            Let&apos;s <span className="accent-italic text-terracotta">Connect</span>
          </h2>
          <p className="text-base font-normal max-w-[380px] mt-4 animate-in" style={{ color: '#4A5568' }}>
            I welcome conversations about educational leadership, institution building, and the future of learning in India.
          </p>
          <div className="flex flex-col gap-5 mt-10 animate-in">
            <a href="mailto:ponnoliprakash@gmail.com" className="flex items-center gap-3 text-[15px] font-medium transition-colors duration-200 hover:text-terracotta" style={{ color: '#2D2D2D' }}>
              <Mail size={20} style={{ color: '#8B9D83' }} /> ponnoliprakash@gmail.com
            </a>
            <a href="tel:+918668088873" className="flex items-center gap-3 text-[15px] font-medium transition-colors duration-200 hover:text-terracotta" style={{ color: '#2D2D2D' }}>
              <Phone size={20} style={{ color: '#8B9D83' }} /> +91 86680 88873
            </a>
            <div className="flex items-center gap-3 text-[15px] font-medium" style={{ color: '#2D2D2D' }}>
              <MapPin size={20} className="shrink-0" style={{ color: '#8B9D83' }} /> 172 TNHB Phase 2, Arcot, Tamil Nadu 632503
            </div>
          </div>
        </div>

        <div ref={rightColRef} className="w-full md:w-1/2">
          <div className="rounded-xl p-12" style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(45,45,45,0.08)' }}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <input type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required
                className={inputClasses + ' placeholder:text-[rgba(45,45,45,0.35)]'} style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)} onBlur={(e) => { e.target.style.borderColor = 'rgba(45,45,45,0.1)'; e.target.style.boxShadow = 'none'; }} />
              <input type="email" placeholder="Your Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required
                className={inputClasses + ' placeholder:text-[rgba(45,45,45,0.35)]'} style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)} onBlur={(e) => { e.target.style.borderColor = 'rgba(45,45,45,0.1)'; e.target.style.boxShadow = 'none'; }} />
              <textarea placeholder="Your Message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required rows={5}
                className={inputClasses + ' py-4 resize-none placeholder:text-[rgba(45,45,45,0.35)]'} style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)} onBlur={(e) => { e.target.style.borderColor = 'rgba(45,45,45,0.1)'; e.target.style.boxShadow = 'none'; }} />
              <button type="submit" className="w-full h-[52px] rounded-lg text-[15px] font-medium transition-all duration-200 hover:brightness-90 cursor-pointer" style={{ backgroundColor: '#C4725A', color: '#FFFFFF' }}>Send Message</button>
            </form>
          </div>
        </div>
      </div>
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 px-6 py-4 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-5 duration-300" style={{ backgroundColor: '#2D2D2D', color: '#F5F0EB' }}>
          Thank you! Your message has been sent.
        </div>
      )}
    </section>
  );
}
