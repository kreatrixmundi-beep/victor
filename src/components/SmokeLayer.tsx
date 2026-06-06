import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

// Humo animado: partículas blancas/grises que suben desde un punto
export const SmokeLayer: React.FC<{
  x?: string;
  y?: string;
  color?: string;
}> = ({ x = '30%', y = '60%', color = 'rgba(220,220,220,0.5)' }) => {
  const frame = useCurrentFrame();
  const LOOP = 90; // 3s a 30fps

  const particles = [0, 15, 30, 45, 60, 75];

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {particles.map((offset) => {
        const f = ((frame + offset) % LOOP) / LOOP; // 0→1 en cada ciclo
        const translateY = interpolate(f, [0, 1], [0, -120]);
        const translateX = Math.sin(f * Math.PI * 2) * 8;
        const opacity = interpolate(f, [0, 0.3, 0.7, 1], [0, 0.5, 0.3, 0]);
        const scale = interpolate(f, [0, 1], [0.5, 1.4]);

        return (
          <div
            key={offset}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: color,
              opacity,
              transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
              filter: 'blur(6px)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
