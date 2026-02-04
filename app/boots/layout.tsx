import clsx from 'clsx'
import React from 'react'

export default function BootsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={clsx('h-screen w-screen relative')}>
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
      {children}
    </div>
  )
}
