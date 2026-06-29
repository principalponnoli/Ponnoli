import { useEffect, useRef, useState } from 'react';

interface PortraitRevealProps {
  imageSrc: string;
  revealColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function PortraitReveal({
  imageSrc,
  revealColor = '#8B9D83',
  className = '',
  style,
}: PortraitRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const bgimage = imageSrc;
    const img = new Image();
    const dummy = document.createElement('div');
    dummy.style.position = 'absolute';
    dummy.style.opacity = '0';
    dummy.style.pointerEvents = 'none';
    document.body.appendChild(dummy);

    function divGenerator(color: string, url: string, direction: string) {
      dummy.style.backgroundImage = `url(${url})`;
      const fragment = document.createDocumentFragment();
      const count = direction === 'vertical' ? 20 : 10;
      const bgImage = dummy.style.backgroundImage;
      const bgPos = dummy.style.backgroundPosition;
      const step1 = { filter: 'brightness(100%) saturate(100%)', opacity: 1 };
      const step2 = { filter: 'brightness(100%) saturate(100%)', opacity: 0 };

      for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.style.backgroundImage = bgImage;
        div.style.backgroundColor = color;
        div.style.backgroundPosition = bgPos;
        div.style.backgroundBlendMode = 'saturation';
        div.style.position = 'absolute';
        div.style.left = '0';

        if (direction === 'vertical') {
          div.style.top = `${(i / count) * 100}%`;
          div.style.width = '100%';
          div.style.height = `calc(100% / ${count} + 1px)`;
        } else {
          div.style.top = '0';
          div.style.width = `calc(100% / ${count} + 1px)`;
          div.style.height = '100%';
        }

        const pos = (i / (count - 1)) * 100;
        div.style.backgroundPosition = direction === 'vertical' ? `50% ${pos}%` : `${pos}% 50%`;
        div.style.backgroundSize = 'cover';
        fragment.appendChild(div);
      }

      return { el: fragment, step1, step2 };
    }

    img.onload = () => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      // Image loaded successfully
      element.style.width = String(style?.width || '100%');
      element.style.height = String(style?.height || '100%');
      element.style.backgroundImage = `url(${bgimage})`;
      element.style.backgroundSize = 'cover';
      element.style.backgroundPosition = '50% 50%';
      element.style.backgroundColor = 'transparent';
      element.style.opacity = '0';
      element.style.overflow = 'hidden';
      element.style.position = 'relative';

      const revealLayers: Array<{ el: DocumentFragment; step1: Record<string, unknown>; step2: Record<string, unknown> }> = [];
      revealLayers.push(divGenerator('transparent', bgimage, 'horizontal'));
      revealLayers.push(divGenerator(revealColor, bgimage, 'vertical'));

      revealLayers.forEach((layer) => {
        element.appendChild(layer.el);
      });

      const animationTimeline: Record<string, Array<Record<string, unknown>>> = {
        '50%': [],
        '100%': [],
      };

      revealLayers.forEach((layer) => {
        animationTimeline['50%'].push({ ...layer.step1 });
        animationTimeline['100%'].push({ ...layer.step2 });
      });

      animationTimeline['100%'].push({ opacity: 1 });

      const keyframes: Keyframe[] = [];
      const keyframe50: Record<string, string | number> = {};
      const keyframe100: Record<string, string | number> = { opacity: 1 };

      revealLayers.forEach(() => {
        keyframe50['filter'] = 'brightness(100%) saturate(100%)';
        keyframe50['opacity'] = 1;
        keyframe100['filter'] = 'brightness(100%) saturate(100%)';
        keyframe100['opacity'] = 0;
      });

      keyframes.push(keyframe50);
      keyframes.push(keyframe100);

      const children = Array.from(element.children);

      const animation = element.animate(
        [
          { opacity: 0 },
          { opacity: 1, offset: 0.3 },
          { opacity: 1 },
        ],
        {
          duration: 1400,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'forwards',
        }
      );

      children.forEach((child, idx) => {
        const isHorizontal = idx < 10;
        const total = isHorizontal ? 10 : 20;
        const childIdx = idx % total;

        child.animate(
          [
            {
              filter: 'brightness(100%) saturate(100%) blur(0px)',
              opacity: 1,
            },
            {
              filter: 'brightness(100%) saturate(100%) blur(0px)',
              opacity: 1,
              offset: 0.5,
            },
            {
              filter: 'brightness(100%) saturate(0%) blur(0px)',
              opacity: 0,
            },
          ],
          {
            duration: 1400,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            fill: 'forwards',
            delay: childIdx * 30,
          }
        );
      });

      animation.play();

      animation.onfinish = () => {
        dummy.remove();
        element.style.backgroundImage = `url(${bgimage})`;
        element.innerHTML = '';
        element.style.opacity = '1';
        isAnimatingRef.current = false;
        setIsRevealed(true);
      };
    };

    img.src = bgimage;

    return () => {
      dummy.remove();
    };
  }, [imageSrc, revealColor]);

  useEffect(() => {
    if (!isRevealed) return;
    const element = containerRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const tx = (-0.5 + (e.clientX - rect.left) / rect.width) * 2;
      const ty = (-0.5 + (e.clientY - rect.top) / rect.height) * 2;
      element.style.transform = `translate(${-tx * 15}px, ${-ty * 15}px)`;
    };

    const handleMouseLeave = () => {
      element.style.transform = 'translate(0, 0)';
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isRevealed]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        backgroundColor: revealColor,
        willChange: 'transform',
        transition: 'transform 0.3s ease-out',
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%',
        ...style,
      }}
    />
  );
}
