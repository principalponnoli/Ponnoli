export default function Footer() {
  return (
    <footer style={{ padding: '48px 24px', backgroundColor: '#2D2D2D' }}>
      <div className="flex flex-col items-center text-center">
        <p className="text-lg font-bold" style={{ color: '#F5F0EB' }}>S. Ponnoli</p>
        <p className="text-sm font-normal mt-2" style={{ color: 'rgba(245,240,235,0.5)' }}>Educator & Principal</p>
        <div className="w-10 h-px my-5" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
        <p className="text-[13px] font-normal" style={{ color: 'rgba(245,240,235,0.35)' }}>&copy; 2025 S. Ponnoli. All rights reserved.</p>
        <div className="flex items-center gap-2 mt-4 text-[13px] font-medium" style={{ color: 'rgba(245,240,235,0.5)' }}>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-cream" style={{ color: 'rgba(245,240,235,0.5)' }}>LinkedIn</a>
          <span>&middot;</span>
          <a href="mailto:ponnoliprakash@gmail.com" className="transition-colors duration-200 hover:text-cream" style={{ color: 'rgba(245,240,235,0.5)' }}>Email</a>
          <span>&middot;</span>
          <a href="tel:+918668088873" className="transition-colors duration-200 hover:text-cream" style={{ color: 'rgba(245,240,235,0.5)' }}>Phone</a>
        </div>
      </div>
    </footer>
  );
}
