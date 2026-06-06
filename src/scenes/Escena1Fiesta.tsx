import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { ParticleLayer } from '../components/ParticleLayer';
import { Vignette } from '../components/Vignette';

export const Escena1Fiesta: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Fade in/out cinematográfico
  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });
  const opacity = Math.min(fadeIn, fadeOut);

  // Zoom in lento sobre el personaje (él quieto, el mundo se acerca)
  const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.08], { extrapolateRight: 'clamp' });

  // Pulso de luces neón — ciclo de ~15 frames (0.5s)
  const neonPulse = interpolate(Math.sin(frame * 0.42), [-1, 1], [0.4, 0.7]);

  // Bola de disco: rotación completa en 150 frames
  const discRotation = (frame / durationInFrames) * 360;

  // Multitud wobble lateral — muy sutil
  const crowdWobble = Math.sin(frame * 0.25) * 3;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', opacity }}>

      {/* Imagen base con zoom */}
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        <Img
          src={`${process.env.PUBLIC_URL ?? ''}/assets/escena1.png`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* Multitud con micro-wobble y blur — capa sobre la base */}
      <AbsoluteFill
        style={{
          transform: `translateX(${crowdWobble}px) scale(${scale})`,
          transformOrigin: 'center bottom',
          filter: 'blur(1.5px)',
          opacity: 0.25,
        }}
      >
        <Img
          src={`${process.env.PUBLIC_URL ?? ''}/assets/escena1.png`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* Overlay neón morado/rosa pulsando */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(180,80,220,0.35), transparent 70%)',
          opacity: neonPulse,
          mixBlendMode: 'screen',
        }}
      />

      {/* Overlay cian secundario — pulso desfasado */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at 30% 60%, rgba(0,220,220,0.2), transparent 60%)',
          opacity: interpolate(Math.sin(frame * 0.42 + 1.5), [-1, 1], [0.3, 0.6]),
          mixBlendMode: 'screen',
        }}
      />

      {/* Bola de disco: destello giratorio */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '45%',
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.9), transparent 70%)',
            transform: `rotate(${discRotation}deg)`,
            opacity: 0.5,
            filter: 'blur(2px)',
          }}
        />
        {/* Destello puntual cada ~40 frames */}
        {frame % 40 < 5 && (
          <div
            style={{
              position: 'absolute',
              top: '8%',
              left: '48%',
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: 'white',
              opacity: interpolate(frame % 40, [0, 2, 5], [0, 1, 0]),
              filter: 'blur(1px)',
            }}
          />
        )}
      </AbsoluteFill>

      {/* Partículas de luz flotando */}
      <ParticleLayer count={10} color="rgba(255,180,255,0.7)" baseOpacity={0.3} />

      {/* Vignette oscura para enfocar el centro */}
      <Vignette intensity={0.65} />
    </AbsoluteFill>
  );
};
