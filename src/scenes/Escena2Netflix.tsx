import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { SmokeLayer } from '../components/SmokeLayer';
import { ParticleLayer } from '../components/ParticleLayer';
import { Vignette } from '../components/Vignette';

// Genera opacidad irregular tipo parpadeo de TV
const tvFlicker = (frame: number) => {
  // Valores pseudo-aleatorios pero deterministas
  const t = frame * 0.13;
  return 0.4 + Math.sin(t) * 0.08 + Math.sin(t * 3.7) * 0.07 + Math.sin(t * 7.1) * 0.03;
};

export const Escena2Netflix: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });
  const opacity = Math.min(fadeIn, fadeOut);

  // Push-in MUY sutil — la pasividad es el mensaje
  const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.04], { extrapolateRight: 'clamp' });

  // Parpadeo de TV (overlay azul-cian irregular)
  const tvOpacity = tvFlicker(frame);

  // Lámpara cálida fondo: flicker lento
  const lampOpacity = 0.9 + Math.sin(frame * 0.08) * 0.1;

  return (
    <AbsoluteFill style={{ backgroundColor: '#05080f', opacity }}>

      {/* Imagen base — casi estática */}
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        <Img
          src={`${process.env.PUBLIC_URL ?? ''}/assets/escena2.png`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* Overlay parpadeo de TV — azul cian, desde la izquierda donde está el TV */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(to right, rgba(30,120,200,0.55) 0%, transparent 60%)',
          opacity: tvOpacity,
          mixBlendMode: 'screen',
        }}
      />

      {/* Lámpara cálida fondo — sutil flicker amarillo en el rincón */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at 85% 20%, rgba(255,200,80,0.2), transparent 40%)',
          opacity: lampOpacity,
        }}
      />

      {/* Humo del cigarrillo subiendo */}
      <SmokeLayer x="52%" y="55%" color="rgba(200,200,200,0.45)" />

      {/* Polvo en el haz de luz del TV */}
      <ParticleLayer count={6} color="rgba(200,220,255,0.5)" baseOpacity={0.25} />

      <Vignette intensity={0.55} />
    </AbsoluteFill>
  );
};
