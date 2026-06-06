import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

// Grain cinematográfico: ruido SVG que cambia cada frame
export const GrainLayer: React.FC<{ opacity?: number }> = ({ opacity = 0.08 }) => {
  const frame = useCurrentFrame();
  // Seed diferente cada frame para animación de grano
  const seed = frame * 9301 + 49297;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity }}>
      <svg width="100%" height="100%" style={{ position: 'absolute' }}>
        <filter id={`grain-${frame}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            seed={seed % 1000}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${frame})`} />
      </svg>
    </AbsoluteFill>
  );
};
