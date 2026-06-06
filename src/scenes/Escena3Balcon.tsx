import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { SmokeLayer } from '../components/SmokeLayer';
import { Vignette } from '../components/Vignette';

export const Escena3Balcon: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });
  const opacity = Math.min(fadeIn, fadeOut);

  // Paneo lateral derecha→izquierda + leve push-in (contemplación)
  const translateX = interpolate(frame, [0, durationInFrames], [0, -20], { extrapolateRight: 'clamp' });
  const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.05], { extrapolateRight: 'clamp' });

  // Parallax: fondo se mueve más lento (capa duplicada con menor translateX)
  const bgTranslateX = translateX * 0.3;

  // Luces de ciudad titilando — 18 puntos
  const cityLights = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: 5 + (i * 71) % 88,
    y: 20 + (i * 53) % 50,
    phase: (i * 29) % 60,
    freq: 0.04 + (i * 0.011) % 0.06,
  }));

  // Neones cian/magenta: flicker rápido puntual
  const cyanFlicker = frame % 120 < 2 ? 0.9 : 0.6 + Math.sin(frame * 0.05) * 0.1;
  const magentaFlicker = frame % 90 < 2 ? 0.85 : 0.55 + Math.sin(frame * 0.04 + 1) * 0.1;

  return (
    <AbsoluteFill style={{ backgroundColor: '#080c18', opacity }}>

      {/* Fondo skyline con parallax lento */}
      <AbsoluteFill
        style={{
          transform: `translateX(${bgTranslateX}px) scale(${scale * 1.02})`,
          transformOrigin: 'center center',
          opacity: 0.85,
          filter: 'blur(1px)',
        }}
      >
        <Img
          src={`${process.env.PUBLIC_URL ?? ''}/assets/escena3.png`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* Personaje + balcón con movimiento principal */}
      <AbsoluteFill
        style={{
          transform: `translateX(${translateX}px) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <Img
          src={`${process.env.PUBLIC_URL ?? ''}/assets/escena3.png`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* Luces de ciudad titilando */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        {cityLights.map(({ id, x, y, phase, freq }) => {
          const lightOpacity = 0.6 + Math.sin((frame + phase) * freq) * 0.4;
          return (
            <div
              key={id}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: 'rgba(255,240,180,1)',
                opacity: lightOpacity,
                filter: 'blur(1px)',
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Neones de fondo — cian y magenta */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at 25% 35%, rgba(0,220,220,0.15), transparent 30%)',
          opacity: cyanFlicker,
          mixBlendMode: 'screen',
        }}
      />
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at 70% 40%, rgba(220,0,180,0.12), transparent 25%)',
          opacity: magentaFlicker,
          mixBlendMode: 'screen',
        }}
      />

      {/* Humo del cigarrillo — protagonista de la escena */}
      <SmokeLayer x="38%" y="48%" color="rgba(210,210,210,0.5)" />

      <Vignette intensity={0.6} />
    </AbsoluteFill>
  );
};
