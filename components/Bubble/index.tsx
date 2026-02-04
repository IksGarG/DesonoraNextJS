'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import Bubble from './Bubble';

const WORLD_SIZE = 2000;
const productImages = [
  '/images/studio-boots/bota-1.webp',
  '/images/studio-boots/bota-2.webp',
  '/images/studio-boots/bota-3.webp',
  '/images/studio-boots/bota-4.webp',
  '/images/studio-boots/bota-5.webp',
  '/images/studio-boots/bota-6.webp',
  '/images/studio-boots/bota-7.webp',
  '/images/studio-boots/bota-8.webp',
  '/images/studio-boots/bota-9.webp',
  '/images/studio-boots/bota-10.webp',
  '/images/studio-boots/bota-11.webp',
];

const productLabels = [
  'Bota 1',
  'Bota 2',
  'Bota 3',
  'Bota 4',
  'Bota 5',
  'Bota 6',
  'Bota 7',
  'Bota 8',
  'Bota 9',
  'Bota 10',
  'Bota 11',
];

const sizeCycle = [172, 160, 180, 200, 170, 180, 190, 165, 175, 160];

const offsets = [
  { x: -12, y: -10 },
  { x: 18, y: -6 },
  { x: -8, y: 14 },
  { x: 20, y: 18 },
  { x: -16, y: 6 },
  { x: 10, y: -14 },
  { x: -6, y: 20 },
  { x: 14, y: -4 },
  { x: -18, y: 10 },
  { x: 6, y: 16 },
  { x: 12, y: -12 },
  { x: -14, y: -2 },
  { x: 16, y: 8 },
  { x: -10, y: 18 },
  { x: 8, y: -16 },
  { x: -20, y: 12 },
  { x: 22, y: -8 },
  { x: -4, y: 14 },
  { x: 14, y: -18 },
  { x: -12, y: 8 },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export default function BubbleWorld() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef({ minX: 0, maxX: 0, minY: 0, maxY: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const logoTargetRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    logoOriginX: 0,
    logoOriginY: 0,
    hasMoved: false,
    pointerId: undefined as number | undefined,
  });
  const quickToRef = useRef<{
    x?: (value: number) => void;
    y?: (value: number) => void;
    logoX?: (value: number) => void;
    logoY?: (value: number) => void;
  }>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { bubbles, contentBounds } = useMemo(() => {
    const centerX = WORLD_SIZE / 2;
    const centerY = WORLD_SIZE / 2;
    const innerSpacing = 380; // Inner ring distance from center
    const outerSpacing = 720; // Outer ring distance from center
    const verticalSquash = 0.7; // Compress vertically (1 = circle, <1 = wider ellipse)

    // Hexagon pattern: inner ring of 6, outer ring of 8
    const hexPositions: { x: number; y: number }[] = [];

    // Inner hexagon ring (6 bubbles) - rotated 30° for flat-top hex
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60 + 30) * (Math.PI / 180);
      hexPositions.push({
        x: centerX + Math.cos(angle) * innerSpacing,
        y: centerY + Math.sin(angle) * innerSpacing * verticalSquash,
      });
    }

    // Outer ring (8 bubbles) - closer to inner ring
    const outerAngles = [0, 45, 90, 135, 180, 225, 270, 315]; // 8 positions around
    for (const deg of outerAngles) {
      const angle = deg * (Math.PI / 180);
      hexPositions.push({
        x: centerX + Math.cos(angle) * outerSpacing,
        y: centerY + Math.sin(angle) * outerSpacing * verticalSquash,
      });
    }

    const data: {
      id: number;
      x: number;
      y: number;
      size: number;
      image: string;
      label: string;
    }[] = [];

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < 14; i += 1) {
      const size = sizeCycle[i % sizeCycle.length];
      const offset = offsets[i % offsets.length];
      const pos = hexPositions[i];

      const x = pos.x - size / 2 + offset.x;
      const y = pos.y - size / 2 + offset.y;

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + size);
      maxY = Math.max(maxY, y + size);

      data.push({
        id: i,
        x,
        y,
        size,
        image: productImages[i % productImages.length],
        label: productLabels[i % productLabels.length],
      });
    }

    return {
      bubbles: data,
      contentBounds: {
        minX,
        minY,
        width: maxX - minX,
        height: maxY - minY,
        centerX: (minX + maxX) / 2,
        centerY: (minY + maxY) / 2,
      },
    };
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const camera = cameraRef.current;
    if (!viewport || !camera) return;

    const updateBounds = () => {
      const { clientWidth: width, clientHeight: height } = viewport;
      // Add padding around content for comfortable dragging
      const padding = 100;

      // Calculate symmetric bounds based on content dimensions
      // How much the content extends beyond the viewport on each side
      const extraWidth = Math.max(
        0,
        (contentBounds.width + padding * 2 - width) / 2
      );
      const extraHeight = Math.max(
        0,
        (contentBounds.height + padding * 2 - height) / 2
      );

      // Symmetric bounds: equal movement in all directions
      const minX = -extraWidth;
      const maxX = extraWidth;
      const minY = -extraHeight;
      const maxY = extraHeight;
      boundsRef.current = { minX, maxX, minY, maxY };

      // Start centered (camera offset = 0 means content center aligns with viewport center)
      const centeredX = width / 2 - contentBounds.centerX;
      const centeredY = height / 2 - contentBounds.centerY;
      targetRef.current = {
        x: clamp(centeredX, centeredX + minX, centeredX + maxX),
        y: clamp(centeredY, centeredY + minY, centeredY + maxY),
      };

      // Store the center offset for drag calculations
      boundsRef.current = {
        minX: centeredX - extraWidth,
        maxX: centeredX + extraWidth,
        minY: centeredY - extraHeight,
        maxY: centeredY + extraHeight,
      };

      gsap.set(camera, {
        x: targetRef.current.x,
        y: targetRef.current.y,
        force3D: true,
      });
    };

    updateBounds();
    const quickX = gsap.quickTo(camera, 'x', {
      duration: 0.6,
      ease: 'power3.out',
    });
    const quickY = gsap.quickTo(camera, 'y', {
      duration: 0.6,
      ease: 'power3.out',
    });

    // Logo parallax (moves slower than camera for depth effect)
    const logo = logoRef.current;
    const quickLogoX = logo
      ? gsap.quickTo(logo, 'x', { duration: 0.8, ease: 'power3.out' })
      : undefined;
    const quickLogoY = logo
      ? gsap.quickTo(logo, 'y', { duration: 0.8, ease: 'power3.out' })
      : undefined;

    quickToRef.current = {
      x: quickX,
      y: quickY,
      logoX: quickLogoX,
      logoY: quickLogoY,
    };

    const handleResize = () => updateBounds();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [contentBounds]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    // Don't capture pointer yet - wait until we confirm it's a drag
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      originX: targetRef.current.x,
      originY: targetRef.current.y,
      logoOriginX: logoTargetRef.current.x,
      logoOriginY: logoTargetRef.current.y,
      hasMoved: false,
      pointerId: event.pointerId,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const dx = event.clientX - dragRef.current.startX;
    const dy = event.clientY - dragRef.current.startY;

    // Only start dragging if moved more than 5px (to allow clicks)
    if (!dragRef.current.hasMoved && Math.abs(dx) < 5 && Math.abs(dy) < 5) {
      return;
    }

    if (!dragRef.current.hasMoved) {
      dragRef.current.hasMoved = true;
      setIsDragging(true);
      // Now capture the pointer since we're actually dragging
      const viewport = viewportRef.current;
      if (viewport && dragRef.current.pointerId !== undefined) {
        viewport.setPointerCapture(dragRef.current.pointerId);
      }
    }

    const { minX, maxX, minY, maxY } = boundsRef.current;
    const nextX = clamp(dragRef.current.originX + dx, minX, maxX);
    const nextY = clamp(dragRef.current.originY + dy, minY, maxY);
    targetRef.current = { x: nextX, y: nextY };
    quickToRef.current.x?.(nextX);
    quickToRef.current.y?.(nextY);

    // Parallax effect for logo (moves at 20% of camera speed)
    // Calculate based on actual camera movement (clamped), not raw drag delta
    const parallaxFactor = 0.2;
    const actualCameraDx = nextX - dragRef.current.originX;
    const actualCameraDy = nextY - dragRef.current.originY;
    const logoX = dragRef.current.logoOriginX + actualCameraDx * parallaxFactor;
    const logoY = dragRef.current.logoOriginY + actualCameraDy * parallaxFactor;
    logoTargetRef.current = { x: logoX, y: logoY };
    quickToRef.current.logoX?.(logoX);
    quickToRef.current.logoY?.(logoY);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const wasDragging = dragRef.current.hasMoved;
    dragRef.current.active = false;
    dragRef.current.hasMoved = false;

    if (wasDragging) {
      setIsDragging(false);
    }

    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      ref={viewportRef}
      className={`relative h-screen w-screen touch-none overflow-hidden bg-[#f8f9fa] text-gray-900 dark:bg-[#0a0a0a] dark:text-gray-100 select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className="pointer-events-none absolute inset-0">
        {/* Light mode background */}
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(44,81,61,0.15),transparent_60%),radial-gradient(800px_circle_at_80%_80%,rgba(232,190,59,0.12),transparent_60%),linear-gradient(180deg,#F8F8F8_0%,#E6E1D6_100%)] dark:bg-[radial-gradient(900px_circle_at_20%_10%,rgba(44,81,61,0.25),transparent_60%),radial-gradient(800px_circle_at_80%_80%,rgba(232,190,59,0.15),transparent_60%),linear-gradient(180deg,#0a0a0a_0%,#171717_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02),rgba(255,255,255,0.4)_65%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),rgba(0,0,0,0.6)_65%)]" />
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.20] dark:opacity-[0.15]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div ref={logoRef} className="transform-gpu">
          {/* Light mode logo */}
          <Image
            src="/images/logo/DesonoraLogoColor.png"
            alt="Desonora"
            width={400}
            height={400}
            className="block opacity-100 select-none dark:hidden"
            priority
          />
          {/* Dark mode logo */}
          <Image
            src="/images/logo/DesonoraLogoWhite.png"
            alt="Desonora"
            width={400}
            height={400}
            className="hidden opacity-100 select-none dark:block"
            priority
          />
        </div>
      </div>

      <div
        ref={cameraRef}
        className="absolute inset-0 transform-gpu will-change-transform"
      >
        <div
          className="relative"
          style={{ width: WORLD_SIZE, height: WORLD_SIZE }}
        >
          {isMounted &&
            bubbles.map((bubble) => (
              <Bubble
                key={bubble.id}
                id={bubble.id}
                x={bubble.x}
                y={bubble.y}
                size={bubble.size}
                image={bubble.image}
                label={bubble.label}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
