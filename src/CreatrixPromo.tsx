import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

// ─── BackgroundGlow ────────────────────────────────────────────────────────
// Renders the persistent animated background: deep navy base, two soft glow
// blobs (blue + orange) that breathe via a sine-wave scale, and a subtle
// dot-grid SVG overlay.
const BackgroundGlow: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle breathing effect: scale oscillates slightly over time
  const breathe = Math.sin(frame / 60) * 0.1 + 1;

  return (
    <AbsoluteFill style={{ background: "#0A0E1A", overflow: "hidden" }}>
      {/* Blue glow blob – left-center */}
      <div
        style={{
          position: "absolute",
          width: "60%",
          height: "80%",
          left: "5%",
          top: "10%",
          background:
            "radial-gradient(ellipse at center, rgba(37,99,235,0.15) 0%, transparent 70%)",
          filter: "blur(120px)",
          transform: `scale(${breathe})`,
          transformOrigin: "center center",
        }}
      />
      {/* Orange glow blob – right-center */}
      <div
        style={{
          position: "absolute",
          width: "45%",
          height: "70%",
          right: "5%",
          top: "15%",
          background:
            "radial-gradient(ellipse at center, rgba(255,107,44,0.10) 0%, transparent 70%)",
          filter: "blur(100px)",
          transform: `scale(${breathe * 0.95})`,
          transformOrigin: "center center",
        }}
      />
      {/* Dot grid overlay – 2 px dots every 40 px at very low opacity */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.04,
        }}
      >
        <defs>
          <pattern
            id="dotGrid"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="#F5F7FA" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotGrid)" />
      </svg>
    </AbsoluteFill>
  );
};

const FONT = '"Inter", "Helvetica Neue", Arial, sans-serif';
const EASING = Easing.out(Easing.cubic);

// ─── CreatrixPromo ────────────────────────────────────────────────────────
// Main composition: 1920×1080, 30 fps, 540 frames (18 s).
// Five scenes rendered with opacity-based transitions (nothing is unmounted).
export const CreatrixPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // spring is available for use in future enhancements
  void spring; void fps;

  // ── Scene 1 (frames 0–90): Intro ──────────────────────────────────────
  // "CREATRIX" title fades + scales in, then fades out at the end.
  // Tagline appears with a slight delay and fades out together.
  const s1TitleOpacity = interpolate(
    frame,
    [0, 25, 75, 90],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING }
  );
  const s1TitleScale = interpolate(
    frame,
    [0, 25],
    [0.92, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING }
  );
  const s1TaglineOpacity = interpolate(
    frame,
    [15, 40, 75, 90],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING }
  );

  // ── Scene 2 (frames 90–195): Hook ─────────────────────────────────────
  // Two-line hook text slides up and fades in, then fades out.
  const s2Opacity = interpolate(
    frame,
    [90, 115, 175, 195],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING }
  );
  const s2TranslateY = interpolate(
    frame,
    [90, 115],
    [20, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING }
  );

  // ── Scene 3 (frames 195–390): Services ────────────────────────────────
  // Two service cards stagger in sequentially with slide-up + fade-in,
  // then each fades out independently.
  const s3Block1Opacity = interpolate(
    frame,
    [195, 220, 310, 330],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING }
  );
  const s3Block1Y = interpolate(
    frame,
    [195, 220],
    [30, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING }
  );
  const s3Block2Opacity = interpolate(
    frame,
    [250, 275, 370, 390],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING }
  );
  const s3Block2Y = interpolate(
    frame,
    [250, 275],
    [30, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING }
  );

  // ── Scene 4 (frames 390–465): Value proposition ───────────────────────
  // Bold value statement fades and slides in, then fades out.
  const s4Opacity = interpolate(
    frame,
    [390, 415, 445, 465],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING }
  );
  const s4TranslateY = interpolate(
    frame,
    [390, 415],
    [20, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING }
  );

  // ── Scene 5 (frames 465–540): Closing CTA ────────────────────────────
  // CREATRIX reappears, an orange pill CTA button fades in, then the domain.
  const s5TitleOpacity = interpolate(
    frame,
    [465, 490],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING }
  );
  const s5CtaOpacity = interpolate(
    frame,
    [480, 505],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING }
  );
  const s5DomainOpacity = interpolate(
    frame,
    [495, 520],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING }
  );

  return (
    <AbsoluteFill>
      {/* Always-visible animated background */}
      <BackgroundGlow />

      {/* ── Scene 1: Intro ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: s1TitleOpacity,
          transform: `scale(${s1TitleScale})`,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 96,
            letterSpacing: "0.2em",
            color: "#FFFFFF",
            lineHeight: 1,
          }}
        >
          CREATRIX
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 22,
            color: "#F5F7FA",
            opacity: s1TaglineOpacity,
            marginTop: 20,
            letterSpacing: "0.05em",
          }}
        >
          Marketing impulsado por IA.
        </div>
      </AbsoluteFill>

      {/* ── Scene 2: Hook ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: s2Opacity,
          transform: `translateY(${s2TranslateY}px)`,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 64,
            color: "#F5F7FA",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          Tu marca merece
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 64,
            color: "#2563EB",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          crecer más rápido.
        </div>
      </AbsoluteFill>

      {/* ── Scene 3: Services ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          pointerEvents: "none",
        }}
      >
        {/* Block 1: Ads que convierten */}
        <div
          style={{
            width: 800,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 24,
            opacity: s3Block1Opacity,
            transform: `translateY(${s3Block1Y}px)`,
            background: "rgba(255,255,255,0.04)",
            borderRadius: 16,
            padding: "32px 36px",
            border: "1px solid rgba(255,255,255,0.06)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: 4,
              height: 60,
              background: "#FF6B2C",
              borderRadius: 4,
              flexShrink: 0,
            }}
          />
          <div>
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 36,
                color: "#FFFFFF",
                marginBottom: 10,
                letterSpacing: "0.04em",
              }}
            >
              ADS QUE CONVIERTEN
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 18,
                color: "#F5F7FA",
                opacity: 0.7,
                lineHeight: 1.5,
              }}
            >
              Campañas optimizadas con IA que generan clientes, no solo clics.
            </div>
          </div>
        </div>

        {/* Block 2: Automatizaciones que escalan */}
        <div
          style={{
            width: 800,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 24,
            opacity: s3Block2Opacity,
            transform: `translateY(${s3Block2Y}px)`,
            background: "rgba(255,255,255,0.04)",
            borderRadius: 16,
            padding: "32px 36px",
            border: "1px solid rgba(255,255,255,0.06)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: 4,
              height: 60,
              background: "#2563EB",
              borderRadius: 4,
              flexShrink: 0,
            }}
          />
          <div>
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 36,
                color: "#FFFFFF",
                marginBottom: 10,
                letterSpacing: "0.04em",
              }}
            >
              AUTOMATIZACIONES QUE ESCALAN
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 18,
                color: "#F5F7FA",
                opacity: 0.7,
                lineHeight: 1.5,
              }}
            >
              Procesos en piloto automático. Menos trabajo manual, más resultados.
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* ── Scene 4: Value proposition ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: s4Opacity,
          transform: `translateY(${s4TranslateY}px)`,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 52,
            color: "#F5F7FA",
            textAlign: "center",
            lineHeight: 1.25,
          }}
        >
          Más leads. Menos esfuerzo.
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 52,
            textAlign: "center",
            lineHeight: 1.25,
            marginTop: 8,
          }}
        >
          <span style={{ color: "#F5F7FA" }}>Powered by </span>
          <span style={{ color: "#FF6B2C" }}>IA.</span>
        </div>
      </AbsoluteFill>

      {/* ── Scene 5: Closing CTA ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 96,
            letterSpacing: "0.2em",
            color: "#FFFFFF",
            opacity: s5TitleOpacity,
            lineHeight: 1,
          }}
        >
          CREATRIX
        </div>
        {/* Orange pill CTA button */}
        <div
          style={{
            marginTop: 36,
            opacity: s5CtaOpacity,
            background: "#FF6B2C",
            borderRadius: 40,
            padding: "16px 40px",
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 20,
            color: "#FFFFFF",
            letterSpacing: "0.02em",
          }}
        >
          Hablemos →
        </div>
        {/* Domain */}
        <div
          style={{
            marginTop: 20,
            opacity: s5DomainOpacity * 0.5,
            fontFamily: FONT,
            fontSize: 16,
            color: "#F5F7FA",
            letterSpacing: "0.05em",
          }}
        >
          creatrix.ai
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
