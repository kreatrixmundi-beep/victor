import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { ParticleLayer } from '../components/ParticleLayer';
import { GrainLayer } from '../components/GrainLayer';

export const Escena4Espejo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  // Esta es la última escena — fade out más suave al final
  const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });
  const opacity = Math.min(fadeIn, fadeOut);

  // Zoom dramático lento hacia los ojos — cubic easing manual
  const t = frame / durationInFrames;
  const easedT = t * t * (3 - 2 * t); // smoothstep
  const scale = 1.0 + easedT * 0.15; // 1.0 → 1.15

  // Vignette dinámica: se cierra ligeramente conforme avanza
  const vignetteIntensity = interpolate(frame, [0, durationInFrames], [0.5, 0.75], { extrapolateRight: 'clamp' });

  // Luz cálida pulsando como latido (MUY lento)
  const warmPulse = 0.85 + Math.sin(frame * 0.075) * 0.08;

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a0800', opacity }}>

      {/* Imagen base con zoom dramático centrado en los ojos */}
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          transformOrigin: '50% 42%', // ligeramente arriba del centro → hacia los ojos
        }}
      >
        <Img
          src={`${process.env.PUBLIC_URL ?? ''}/assets/escena4.png`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* Luz cálida fondo pulsando (latido contenido) */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at 65% 30%, rgba(200,80,20,0.25), transparent 55%)',
          opacity: warmPulse,
          mixBlendMode: 'screen',
        }}
      />

      {/* Vignette dinámica que se cierra */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,${vignetteIntensity}) 100%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Partículas doradas en el haz de luz */}
      <ParticleLayer count={5} color="rgba(255,200,80,0.8)" baseOpacity={0.2} />

      {/* Grain cinematográfico — textura de película */}
      <GrainLayer opacity={0.08} />
    </AbsoluteFill>
  );
};
