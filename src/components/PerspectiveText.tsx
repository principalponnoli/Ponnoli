import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PerspectiveTextProps {
  text: string;
  className?: string;
}

function splitToLines(text: string, containerWidth: number, charWidth: number): string[] {
  const maxCharsPerLine = Math.floor(containerWidth / charWidth);
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? currentLine + ' ' + word : word;
    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

export default function PerspectiveText({ text, className = '' }: PerspectiveTextProps) {
  const tileRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const tile = tileRef.current;
    if (!tile) return;

    const initAnimation = () => {
      const perspective = 400;
      const computedStyle = window.getComputedStyle(tile);
      const fontSize = parseFloat(computedStyle.fontSize);
      const charWidth = fontSize * 0.6;
      const containerWidth = tile.parentElement?.clientWidth || tile.clientWidth;
      const fullText = tile.textContent?.trim() || text;
      tile.innerHTML = '';

      const lines = splitToLines(fullText, containerWidth, charWidth);

      lines.forEach((line) => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'perspective-line';
        lineDiv.style.cssText = `position: relative; perspective: ${perspective}px; display: flex; justify-content: center; flex-wrap: nowrap; margin: 0.15em 0; line-height: 1.1;`;

        for (let i = 0; i < line.length; i++) {
          const span = document.createElement('span');
          span.textContent = line[i] === ' ' ? '\u00A0' : line[i];
          span.style.cssText = 'display: inline-block; transform-style: preserve-3d; transform-origin: center center; will-change: transform, opacity, filter;';
          span.dataset.charIndex = String(i);
          lineDiv.appendChild(span);
        }
        tile.appendChild(lineDiv);
      });

      const allChars = tile.querySelectorAll('span');
      const totalChars = allChars.length;

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: tile,
          start: 'top 85%',
          end: 'top 20%',
          scrub: true,
        },
      });

      allChars.forEach((char, index) => {
        const staggerRatio = index / Math.max(totalChars - 1, 1);
        scrollTl.from(
          char,
          {
            z: -800,
            rotateY: 180,
            rotateX: 360,
            filter: 'blur(10px)',
            opacity: 0,
            ease: 'power1.out',
            duration: 1,
          },
          staggerRatio * 0.95
        );
      });

      // Mouse tilt effect
      const handleMouseMove = (e: MouseEvent) => {
        const rect = tile.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rotateY = ((e.clientX - centerX) / rect.width) * 1.4;
        const rotateX = -((e.clientY - centerY) / rect.height) * 1.4;
        tile.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      };

      const handleMouseLeave = () => {
        tile.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg)`;
      };

      tile.addEventListener('mousemove', handleMouseMove);
      tile.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        tile.removeEventListener('mousemove', handleMouseMove);
        tile.removeEventListener('mouseleave', handleMouseLeave);
        scrollTl.kill();
      };
    };

    // Wait for fonts and layout
    requestAnimationFrame(() => {
      requestAnimationFrame(initAnimation);
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === tile) st.kill();
      });
    };
  }, [text]);

  return (
    <div className={`tile ${className}`}>
      <div
        ref={tileRef}
        data-tilt-perspective="400"
        data-tilt-reset="false"
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          padding: '2rem',
          boxSizing: 'border-box',
          overflow: 'visible',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '22px',
          color: '#4A5568',
          lineHeight: 1.8,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.1s ease-out',
        }}
      >
        {text}
      </div>
    </div>
  );
}
