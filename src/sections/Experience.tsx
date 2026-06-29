import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    school: "St. Joseph's Matric. Hr. Sec. School",
    location: 'Veppoor, Melvisharam, Walaja Taluk, Vellore District',
    role: 'Principal',
    board: 'State Board',
    description:
      'Led academic administration and school operations for over seven years. Managed faculty, student development, examinations, and institutional planning. Improved academic standards while ensuring compliance with the Tamil Nadu State Board curriculum. Strengthened parent engagement, teacher performance, and overall school excellence.',
  },
  {
    school: 'BMD Jain School (ICSE)',
    location: 'Arihanth Nagar, Kalinjur, Vellore',
    role: 'Principal',
    board: 'ICSE',
    description:
      'Directed all academic and administrative functions under the ICSE curriculum. Achieved consistently excellent academic performance through strategic planning. Mentored teachers, implemented innovative learning practices, and enhanced institutional quality. Fostered a culture of discipline, excellence, and continuous improvement.',
  },
  {
    school: 'Shri Anand Vidyalaya (Matriculation)',
    location: 'Tambaram, Chennai',
    role: 'Principal',
    board: 'Matriculation',
    description:
      'Headed school administration and academic leadership under the CBSE curriculum. Led curriculum implementation, faculty development, and student performance initiatives. Strengthened school operations through effective planning and quality management. Promoted holistic education with a focus on innovation and leadership.',
  },
  {
    school: 'Bharat Matriculation School',
    location: 'Vellore',
    role: 'Principal',
    board: 'State Board',
    description:
      'Managed overall school operations including academics, administration, and staff coordination. Enhanced student outcomes through structured academic planning. Oversaw school policies, examinations, admissions, and stakeholder engagement. Ensured smooth institutional functioning while maintaining high educational standards.',
  },
  {
    school: 'MAHALAKSHMI VIDHYASHRAM SCHOOL (CBSE)',
    location: 'Arcot',
    role: 'Principal',
    board: 'CBSE',
    description:
      'Led the institution with a strong focus on academic excellence and organizational growth. Supervised curriculum execution, teacher mentoring, and student development. Implemented best practices in school administration and quality assurance. Built collaborative relationships with parents, faculty, and the management team.',
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const cards = section.querySelectorAll('.exp-card');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' },
    });
    tl.fromTo(cards, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' });
    return () => { tl.kill(); };
  }, []);

  return (
    <section ref={sectionRef} id="experience" style={{ padding: '120px 48px', backgroundColor: '#F5F0EB' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <p className="section-label text-terracotta">EXPERIENCE</p>
          <h2 className="text-[48px] font-bold mt-3 tracking-[-0.02em]" style={{ color: '#2D2D2D' }}>
            Schools & Institutions
          </h2>
          <p className="text-base font-normal mt-3" style={{ color: '#4A5568' }}>
            A journey across Tamil Nadu's finest educational institutions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="exp-card rounded-xl p-8 border transition-all duration-300 hover:-translate-y-0.5"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: 'rgba(45,45,45,0.08)',
                boxShadow: '0 0 0 transparent',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196, 114, 90, 0.25)';
                (e.currentTarget as HTMLElement).style.backgroundColor = '#FFFFFF';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.06)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(45,45,45,0.08)';
                (e.currentTarget as HTMLElement).style.backgroundColor = '#FFFFFF';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 transparent';
              }}
            >
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold" style={{ color: '#2D2D2D' }}>{exp.school}</h3>
                {exp.board && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(139,157,131,0.12)', color: '#6B7F5F' }}>{exp.board}</span>
                )}
              </div>
              {exp.location && (
                <div className="flex items-center gap-1.5 mt-2">
                  <MapPin size={14} style={{ color: '#8B9D83' }} />
                  <span className="text-sm font-normal" style={{ color: '#4A5568' }}>{exp.location}</span>
                </div>
              )}
              <span className="inline-block mt-3 px-3 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(196,114,90,0.08)', color: '#C4725A' }}>
                {exp.role}
              </span>
              <p className="text-[15px] font-normal leading-[1.65] mt-4" style={{ color: '#4A5568' }}>
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
