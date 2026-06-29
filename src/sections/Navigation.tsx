import { useEffect, useState, useCallback } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection('#' + entry.target.id); }); },
      { threshold: 0.3 }
    );
    navLinks.forEach((link) => { const el = document.querySelector(link.href); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) { window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' }); }
  }, []);

  const handleLogoClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          height: 72,
          backgroundColor: scrolled ? 'rgba(250, 248, 245, 0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(45, 45, 45, 0.06)' : '1px solid transparent',
        }}>
        <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between px-6 md:px-12">
          <a href="#" onClick={handleLogoClick} className="hidden font-bold text-lg tracking-[-0.02em]" style={{ color: '#2D2D2D' }}>
            S. Ponnoli
          </a>
          <div className="hidden md:flex items-center gap-8 ml-auto">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={(e) => handleNavClick(e, link.href)}
                className="relative text-sm font-medium transition-colors duration-200"
                style={{ color: activeSection === link.href ? '#2D2D2D' : 'rgba(45,45,45,0.5)' }}>
                {link.label}
                {activeSection === link.href && <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-terracotta" />}
              </a>
            ))}
          </div>
          <button className="md:hidden ml-auto" style={{ color: '#2D2D2D' }} onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center animate-in fade-in duration-300" style={{ backgroundColor: '#FAF8F5' }}>
          <button className="absolute top-6 right-6" style={{ color: '#2D2D2D' }} onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <X size={24} />
          </button>
          <div className="flex flex-col items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="text-[28px] font-medium" style={{ color: '#2D2D2D' }}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
