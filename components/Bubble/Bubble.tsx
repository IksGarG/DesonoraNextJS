'use client';

import gsap from 'gsap';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

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
  const animRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = animRef.current;
    if (!el) return;

    // Single combined animation for all movement - reduces tween count by 50%
    const offsetX = gsap.utils.random(-12, 12);
    const offsetY = gsap.utils.random(-10, 10);
    const duration = gsap.utils.random(10, 16);
    const delay = gsap.utils.random(0, 3);

    const tween = gsap.to(el, {
      x: offsetX,
      y: offsetY,
      duration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay,
      force3D: true,
    });

    return () => {
      tween.kill();
    };
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
      ref={animRef}
      className="absolute transform-gpu"
      style={{ left: x, top: y, width: size, height: size }}
    >
      <div className="group h-full w-full">
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
          {/* Rotating text - slower spin for smoother animation */}
          <svg
            className="animate-spin-slow absolute inset-0 h-full w-full"
            viewBox={`0 0 ${ringSize} ${ringSize}`}
            style={{ animationDuration: '30s' }}
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
          }}
          className="relative h-full w-full transform-gpu cursor-pointer overflow-hidden rounded-full border border-gray-200 bg-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-md transition-[border-color,background-color,box-shadow] duration-200 ease-out hover:border-white hover:bg-white hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none dark:border-gray-700 dark:bg-gray-900/80 dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] dark:hover:border-gray-600 dark:hover:bg-gray-900 dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] dark:focus-visible:ring-gray-600"
          aria-label={label}
        >
          <div className="h-full w-full">
            <div className="pointer-events-none absolute inset-0 select-none">
              <Image
                src={image}
                alt={label}
                fill
                sizes="(max-width: 768px) 140px, 200px"
                className="object-cover"
                priority={id < 6}
                draggable={false}
              />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
