import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

// Partículas flotando hacia arriba — reutilizable
export const ParticleLayer: React.FC<{
  count?: number;
  color?: string;
  baseOpacity?: number;
}> = ({ count = 10, color = 'rgba(255,220,180,0.6)', baseOpacity = 0.35 }) => {
  const frame = useCurrentFrame();

  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 10 + (i * 83) % 80, // distribución pseudo-aleatoria
    startY: 20 + (i * 61) % 70,
    speed: 0.3 + (i * 0.17) % 0.4,
    phase: (i * 37) % 90,
    size: 4 + (i * 13) % 6,
  }));

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {particles.map(({ id, x, startY, speed, phase, size }) => {
        const f = (frame + phase) * speed;
        const translateY = -(f % 100) * 8;
        const opacity = baseOpacity * (0.6 + Math.sin((frame + phase) * 0.05) * 0.4);

        return (
          <div
            key={id}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${startY}%`,
              width: size,
              height: size,
              borderRadius: '50%',
              background: color,
              opacity,
              transform: `translateY(${translateY}px)`,
              filter: 'blur(1px)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
