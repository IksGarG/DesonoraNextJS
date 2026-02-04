'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export type BubbleProps = {
  id: number;
  x: number;
  y: number;
  size: number;
  image: string;
  label: string;
  onSelect?: (id: number) => void;
};

export default function Bubble({
  id,
  x,
  y,
  size,
  image,
  label,
  onSelect,
}: BubbleProps) {
  const driftRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const driftEl = driftRef.current;
    const floatEl = floatRef.current;
    if (!driftEl || !floatEl) return;

    const ctx = gsap.context(() => {
      const driftX = gsap.utils.random(-22, 22);
      const driftY = gsap.utils.random(-18, 18);
      const floatY = gsap.utils.random(-26, 26);
      const scaleTo = gsap.utils.random(0.96, 1.06);
      const driftDuration = gsap.utils.random(8, 14);
      const floatDuration = gsap.utils.random(6, 12);
      const delay = gsap.utils.random(0, 2.5);

      // Combined drift animation (x + y)
      gsap.to(driftEl, {
        x: driftX,
        y: driftY,
        duration: driftDuration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay,
      });

      // Combined float animation (y + scale) - reduces tween count
      gsap.to(floatEl, {
        y: floatY,
        scale: scaleTo,
        duration: floatDuration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay * 0.6,
      });
    }, driftEl);

    return () => ctx.revert();
  }, []);

  // Calculate the radius for the text path (centered in the donut ring)
  const ringSize = size + 48; // The expanded ring size
  const ringOffset = (ringSize - size) / 2; // Offset to center the ring
  const innerRadius = size / 2 + 2; // Inner edge of donut
  const outerRadius = ringSize / 2; // Outer edge of donut
  const textRadius = (innerRadius + outerRadius) / 2; // Center of the donut ring
  // Repeat the label to fill the circle
  const repeatedLabel = `${label} • ${label} • ${label} • ${label} • ${label} • ${label} • ${label} • ${label} • ${label} • ${label} • `;

  return (
    <div
      ref={driftRef}
      className="absolute"
      style={{ left: x, top: y, width: size, height: size }}
    >
      <div ref={floatRef} className="group h-full w-full">
        {/* Expanded ring with curved text - positioned behind the button */}
        <div
          className="pointer-events-none absolute scale-75 opacity-0 transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100"
          style={{
            left: -ringOffset,
            top: -ringOffset,
            width: ringSize,
            height: ringSize,
          }}
        >
          {/* Black donut ring using SVG mask */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${ringSize} ${ringSize}`}
          >
            <defs>
              <mask id={`donutMask-${id}`}>
                {/* White = visible, black = hidden */}
                <circle
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={ringSize / 2}
                  fill="white"
                />
                <circle
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={size / 2 + 2}
                  fill="black"
                />
              </mask>
            </defs>
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={ringSize / 2}
              className="fill-neutral-900 dark:fill-white"
              mask={`url(#donutMask-${id})`}
            />
          </svg>
          {/* Rotating text */}
          <svg
            className="animate-spin-slow absolute inset-0 h-full w-full"
            viewBox={`0 0 ${ringSize} ${ringSize}`}
            style={{ animationDuration: '20s' }}
          >
            <defs>
              <path
                id={`circlePath-${id}`}
                d={`M ${ringSize / 2}, ${ringSize / 2} m -${textRadius}, 0 a ${textRadius},${textRadius} 0 1,1 ${textRadius * 2},0 a ${textRadius},${textRadius} 0 1,1 -${textRadius * 2},0`}
              />
            </defs>
            <text
              className="fill-white text-[9px] font-medium tracking-[0.25em] uppercase dark:fill-neutral-900"
              dominantBaseline="middle"
            >
              <textPath href={`#circlePath-${id}`} startOffset="0%">
                {repeatedLabel}
              </textPath>
            </text>
          </svg>
        </div>

        <button
          type="button"
          onClick={() => {
            onSelect?.(id);
            console.log('Bubble selected:', id, label);
          }}
          className="relative h-full w-full transform-gpu cursor-pointer overflow-hidden rounded-full border border-gray-200 bg-white/80 opacity-95 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-md transition duration-300 ease-out hover:border-white hover:bg-white hover:opacity-100 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none dark:border-gray-700 dark:bg-gray-900/80 dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] dark:hover:border-gray-600 dark:hover:bg-gray-900 dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] dark:focus-visible:ring-gray-600"
          aria-label={label}
        >
          <div className="h-full w-full transition-transform duration-300 ease-out group-hover:scale-[1.08]">
            <div className="absolute inset-0">
              <Image
                src={image}
                alt={label}
                fill
                sizes="(max-width: 768px) 140px, 200px"
                className="object-cover"
                priority={id < 6}
              />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
