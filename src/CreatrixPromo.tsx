import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  Sequence,
} from "remotion";

// ─── Design tokens ────────────────────────────────────────────────────────
const FONT = '"Inter", "Helvetica Neue", Arial, sans-serif';
const C_BG = "#0A0E1A";
const C_BLUE = "#2563EB";
const C_ORANGE = "#FF6B2C";
const C_TEXT = "#F5F7FA";
const C_MUTED = "#8B93A7";
const EASE = Easing.out(Easing.cubic);

// ─── Helpers ──────────────────────────────────────────────────────────────

/** Smooth 0→1 fade-in between two frames */
const fadeIn = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

/** Smooth 1→0 fade-out between two frames */
const fadeOut = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

/** Glassmorphism card style */
const glass = (glowColor = C_BLUE, glowAlpha = 0.18): React.CSSProperties => ({
  background: "rgba(255,255,255,0.045)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: `1px solid rgba(255,255,255,0.10)`,
  borderRadius: 18,
  boxShadow: `0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.07), 0 0 60px ${glowColor}${Math.round(glowAlpha * 255).toString(16).padStart(2, "0")}`,
});

// ─── BackgroundGlow ───────────────────────────────────────────────────────
// Persistent animated backdrop: deep navy + two breathing radial glows
// (blue left, orange right) + a very subtle 4% opacity dot grid.
const BackgroundGlow: React.FC = () => {
  const frame = useCurrentFrame();
  const breathe = Math.sin(frame / 80) * 0.12 + 1;
  const breathe2 = Math.sin(frame / 100 + 1.5) * 0.1 + 1;

  return (
    <AbsoluteFill style={{ background: C_BG, overflow: "hidden" }}>
      {/* Blue glow – slowly drifts left */}
      <div
        style={{
          position: "absolute",
          width: "70%",
          height: "90%",
          left: `${interpolate(frame, [0, 720], [0, -4], { extrapolateRight: "clamp" })}%`,
          top: "5%",
          background: `radial-gradient(ellipse at 40% 50%, rgba(37,99,235,0.18) 0%, transparent 68%)`,
          filter: "blur(80px)",
          transform: `scale(${breathe})`,
          transformOrigin: "40% 50%",
        }}
      />
      {/* Orange glow – drifts right */}
      <div
        style={{
          position: "absolute",
          width: "55%",
          height: "75%",
          right: `${interpolate(frame, [0, 720], [0, -3], { extrapolateRight: "clamp" })}%`,
          top: "12%",
          background: `radial-gradient(ellipse at 60% 50%, rgba(255,107,44,0.12) 0%, transparent 65%)`,
          filter: "blur(90px)",
          transform: `scale(${breathe2})`,
          transformOrigin: "60% 50%",
        }}
      />
      {/* Dot grid at 4% opacity */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }}>
        <defs>
          <pattern id="dotGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill={C_TEXT} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotGrid)" />
      </svg>
    </AbsoluteFill>
  );
};

// ─── NodeParticles ────────────────────────────────────────────────────────
// Floating network of connected nodes for Scene 1 background.
const NodeParticles: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const nodes = [
    { x: 200, y: 180, r: 3 }, { x: 580, y: 120, r: 2 }, { x: 1100, y: 200, r: 3 },
    { x: 1500, y: 150, r: 2 }, { x: 1750, y: 300, r: 3 }, { x: 300, y: 500, r: 2 },
    { x: 700, y: 420, r: 3 }, { x: 960, y: 600, r: 2 }, { x: 1300, y: 500, r: 3 },
    { x: 1650, y: 600, r: 2 }, { x: 150, y: 750, r: 3 }, { x: 500, y: 820, r: 2 },
    { x: 900, y: 900, r: 3 }, { x: 1400, y: 850, r: 2 }, { x: 1800, y: 800, r: 3 },
  ];
  const edges = [[0,1],[1,2],[2,3],[3,4],[0,5],[1,6],[2,7],[3,8],[4,9],[5,6],[6,7],[7,8],[8,9],[5,10],[6,11],[7,12],[8,13],[9,14]];

  return (
    <svg style={{ position: "absolute", inset: 0, width: 1920, height: 1080, opacity }} viewBox="0 0 1920 1080">
      {edges.map(([a, b], i) => {
        const pulse = Math.sin(frame / 45 + i * 0.7) * 0.3 + 0.3;
        return (
          <line
            key={i}
            x1={nodes[a].x} y1={nodes[a].y}
            x2={nodes[b].x} y2={nodes[b].y}
            stroke={C_BLUE} strokeWidth="0.8"
            strokeOpacity={pulse}
          />
        );
      })}
      {nodes.map((n, i) => {
        const drift = Math.sin(frame / 60 + i) * 4;
        return (
          <circle
            key={i}
            cx={n.x} cy={n.y + drift} r={n.r}
            fill={i % 3 === 0 ? C_ORANGE : C_BLUE}
            opacity={0.6 + Math.sin(frame / 50 + i) * 0.3}
          />
        );
      })}
    </svg>
  );
};

// ─── SCENE 1 — Intro cinemática (frames 0–90, 3 s) ───────────────────────
// Letras de "CREATRIX" entran con blur-to-focus + spring stagger.
// Red de nodos flota en el fondo.
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const letters = "CREATRIX".split("");
  const overallOut = frame > 70 ? fadeOut(frame, 72, 88) : 1;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", display: "flex", flexDirection: "column" }}>
      <NodeParticles opacity={interpolate(frame, [0, 20, 72, 88], [0, 0.6, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />

      {/* CREATRIX — each letter staggered blur-to-focus */}
      <div style={{ display: "flex", gap: 6, opacity: overallOut }}>
        {letters.map((l, i) => {
          const delay = i * 4;
          const sp = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 120, mass: 0.8 } });
          const blurVal = interpolate(sp, [0, 1], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <span
              key={i}
              style={{
                fontFamily: FONT, fontWeight: 800, fontSize: 112,
                letterSpacing: "0.08em", color: C_TEXT,
                opacity: sp,
                transform: `translateY(${interpolate(sp, [0, 1], [30, 0])}px)`,
                filter: `blur(${blurVal}px)`,
                display: "inline-block",
                lineHeight: 1,
              }}
            >
              {l}
            </span>
          );
        })}
      </div>

      {/* Tagline */}
      <div style={{
        fontFamily: FONT, fontSize: 22, color: C_MUTED, letterSpacing: "0.12em",
        marginTop: 18, opacity: fadeIn(frame, 20, 50) * overallOut,
        transform: `translateY(${interpolate(fadeIn(frame, 20, 50), [0, 1], [10, 0])}px)`,
        filter: `blur(${interpolate(fadeIn(frame, 20, 50), [0, 1], [6, 0])}px)`,
      }}>
        Marketing impulsado por IA.
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 2 — Flujo de automatización (frames 90–270, 6 s) ──────────────
// Canvas tipo Zapier: 4 nodos conectados por líneas que se dibujan solas
// (SVG stroke-dashoffset). Un punto luminoso viaja de nodo en nodo;
// al llegar, el nodo se ilumina y aparece un checkmark.
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneIn = fadeIn(frame, 0, 22);
  const sceneOut = frame > 155 ? fadeOut(frame, 158, 178) : 1;
  const visible = sceneIn * sceneOut;

  const nodes = [
    { label: "Nuevo lead", icon: "👤", color: C_BLUE },
    { label: "IA califica", icon: "🤖", color: "#7C3AED" },
    { label: "Email automático", icon: "✉️", color: C_ORANGE },
    { label: "CRM actualizado", icon: "✅", color: "#10B981" },
  ];

  const nodeW = 200, nodeH = 100, gapX = 120;
  const totalW = nodes.length * nodeW + (nodes.length - 1) * gapX;
  const startX = (1920 - totalW) / 2;
  const nodeY = 460;

  const centers = nodes.map((_, i) => ({
    x: startX + i * (nodeW + gapX) + nodeW / 2,
    y: nodeY + nodeH / 2,
  }));

  // Each line draws over 22 frames, staggered by 28 frames each
  const getLineDash = (lineIdx: number) => {
    const lineLen = gapX;
    const start = 18 + lineIdx * 28;
    const progress = interpolate(frame, [start, start + 22], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE,
    });
    return { dashArray: lineLen, dashOffset: lineLen * (1 - progress) };
  };

  // Glowing dot travels segment by segment
  const segments = [
    { from: 0, to: 1, startF: 18, endF: 40 },
    { from: 1, to: 2, startF: 46, endF: 68 },
    { from: 2, to: 3, startF: 74, endF: 96 },
  ];
  let dotX = centers[0].x, dotY = centers[0].y, dotVisible = false;
  for (const seg of segments) {
    if (frame >= seg.startF - 2 && frame <= seg.endF + 4) {
      const t = interpolate(frame, [seg.startF, seg.endF], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE,
      });
      dotX = centers[seg.from].x + (centers[seg.to].x - centers[seg.from].x) * t;
      dotY = centers[seg.from].y;
      dotVisible = true;
    }
  }

  // Node glows when dot arrives
  const nodeActiveFrame = [0, 40, 68, 96];
  const getNodeGlow = (i: number) =>
    interpolate(frame, [nodeActiveFrame[i], nodeActiveFrame[i] + 12], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE,
    });

  // Camera zoom-in effect
  const camScale = interpolate(frame, [0, 30], [1.06, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE,
  });

  const sp = spring({ frame, fps, config: { damping: 20, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ opacity: visible, transform: `scale(${camScale})`, transformOrigin: "center center" }}>
      {/* Title */}
      <div style={{
        position: "absolute", top: 220, left: 0, right: 0, textAlign: "center",
        fontFamily: FONT, fontWeight: 700, fontSize: 44, color: C_TEXT,
        opacity: fadeIn(frame, 5, 25),
        transform: `translateY(${interpolate(sp, [0, 1], [20, 0])}px)`,
        filter: `blur(${interpolate(sp, [0, 1], [8, 0])}px)`,
      }}>
        Automatizaciones que{" "}
        <span style={{ color: C_ORANGE }}>trabajan solas.</span>
      </div>

      {/* SVG: connecting lines + traveling dot */}
      <svg style={{ position: "absolute", inset: 0, width: 1920, height: 1080, overflow: "visible" }}>
        <defs>
          <filter id="dotGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="lineGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {[0, 1, 2].map((i) => {
          const { dashArray, dashOffset } = getLineDash(i);
          const x1 = centers[i].x + nodeW / 2 - 4;
          const x2 = centers[i + 1].x - nodeW / 2 + 4;
          const y = centers[i].y;
          return (
            <line key={i}
              x1={x1} y1={y} x2={x2} y2={y}
              stroke={nodes[i + 1].color} strokeWidth="2.5"
              strokeDasharray={dashArray} strokeDashoffset={dashOffset}
              filter="url(#lineGlow)" opacity={0.85}
            />
          );
        })}

        {dotVisible && (
          <circle cx={dotX} cy={dotY} r={7} fill="white" filter="url(#dotGlow)" opacity={0.95} />
        )}
      </svg>

      {/* Node cards */}
      {nodes.map((node, i) => {
        const glow = getNodeGlow(i);
        const nodeDelay = i * 8;
        const nodeSp = spring({ frame: frame - nodeDelay, fps, config: { damping: 18, stiffness: 90 } });
        const x = startX + i * (nodeW + gapX);

        return (
          <div key={i} style={{
            position: "absolute",
            left: x, top: nodeY,
            width: nodeW, height: nodeH,
            ...glass(node.color, 0.12 + glow * 0.25),
            border: `1px solid ${node.color}${Math.round((0.2 + glow * 0.5) * 255).toString(16).padStart(2, "0")}`,
            boxShadow: `0 0 ${20 + glow * 40}px ${node.color}${Math.round(glow * 0.5 * 255).toString(16).padStart(2, "0")}, 0 8px 30px rgba(0,0,0,0.4)`,
            opacity: nodeSp,
            transform: `translateY(${interpolate(nodeSp, [0, 1], [20, 0])}px)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: 6,
          }}>
            <span style={{ fontSize: 26 }}>{node.icon}</span>
            <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: C_TEXT, textAlign: "center", padding: "0 12px" }}>
              {node.label}
            </span>
            {glow > 0.3 && (
              <div style={{
                position: "absolute", top: -8, right: -8,
                width: 20, height: 20, borderRadius: "50%",
                background: node.color, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, color: "white", opacity: glow,
              }}>✓</div>
            )}
          </div>
        );
      })}

      {/* Subtitle */}
      <div style={{
        position: "absolute", bottom: 200, left: 0, right: 0, textAlign: "center",
        fontFamily: FONT, fontSize: 18, color: C_MUTED, letterSpacing: "0.06em",
        opacity: fadeIn(frame, 30, 55),
      }}>
        Flujos conectados · Ejecución sin fricción · Escala infinita
      </div>
    </AbsoluteFill>
  );
};

// ─── AnimatedNumber ───────────────────────────────────────────────────────
// Cuenta de 0 al valor final interpolando entre dos frames.
const AnimatedNumber: React.FC<{
  value: number; frame: number; startF: number; endF: number; decimals?: number;
}> = ({ value, frame, startF, endF, decimals = 0 }) => {
  const current = interpolate(frame, [startF, endF], [0, value], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE,
  });
  return <>{decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toString()}</>;
};

// ─── SCENE 3 — Dashboard de Ads (frames 270–450, 6 s) ────────────────────
// Panel con gráfico de barras que crece y 3 KPIs cuyos números suben
// en tiempo real como contador animado.
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneIn = fadeIn(frame, 0, 25);
  const sceneOut = frame > 155 ? fadeOut(frame, 158, 178) : 1;
  const visible = sceneIn * sceneOut;

  const sp = spring({ frame, fps, config: { damping: 22, stiffness: 90 } });

  const bars = [38, 52, 45, 68, 75, 88, 100];
  const maxBarH = 160;
  const barW = 36;
  const barGap = 14;
  const barColors = [C_BLUE, C_BLUE, C_BLUE, C_BLUE, C_ORANGE, C_ORANGE, C_ORANGE];

  const kpis = [
    { label: "ROAS", value: 4.8, suffix: "x", prefix: "", decimals: 1 },
    { label: "CTR", value: 3.2, suffix: "%", prefix: "", decimals: 1 },
    { label: "Conversiones", value: 218, suffix: "%", prefix: "+", decimals: 0 },
  ];

  const kpiStartF = 20;
  const kpiEndF = 80;

  return (
    <AbsoluteFill style={{ opacity: visible, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Main dashboard card */}
      <div style={{
        ...glass(C_BLUE, 0.15),
        width: 1200, padding: "52px 60px",
        transform: `scale(${interpolate(sp, [0, 1], [0.96, 1])}) translateY(${interpolate(sp, [0, 1], [24, 0])}px)`,
        filter: `blur(${interpolate(sp, [0, 1], [6, 0])}px)`,
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36 }}>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C_TEXT }}>
              Campaign Performance
            </div>
            <div style={{ fontFamily: FONT, fontSize: 15, color: C_MUTED, marginTop: 6 }}>
              Optimizado con IA · Últimos 30 días
            </div>
          </div>
          {/* Live indicator */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(16,185,129,0.12)", borderRadius: 20,
            padding: "6px 16px", border: "1px solid rgba(16,185,129,0.3)",
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%", background: "#10B981",
              boxShadow: `0 0 ${6 + Math.sin(frame / 15) * 4}px #10B981`,
            }} />
            <span style={{ fontFamily: FONT, fontSize: 13, color: "#10B981", fontWeight: 600 }}>LIVE</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 48, alignItems: "flex-end" }}>
          {/* Bar chart */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: barGap, height: maxBarH + 20 }}>
              {bars.map((pct, i) => {
                const barDelay = i * 5;
                const barHeight = interpolate(frame, [barDelay + 10, barDelay + 40], [0, (pct / 100) * maxBarH], {
                  extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE,
                });
                return (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ fontSize: 11, fontFamily: FONT, color: C_MUTED, opacity: frame > barDelay + 38 ? 1 : 0 }}>
                      {pct}%
                    </div>
                    <div style={{
                      width: barW, height: barHeight,
                      background: `linear-gradient(180deg, ${barColors[i]}, ${barColors[i]}88)`,
                      borderRadius: "6px 6px 2px 2px",
                      boxShadow: `0 0 12px ${barColors[i]}44`,
                    }} />
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: barGap, marginTop: 10 }}>
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d, i) => (
                <div key={i} style={{ width: barW, textAlign: "center", fontFamily: FONT, fontSize: 12, color: C_MUTED }}>
                  {d}
                </div>
              ))}
            </div>
          </div>

          {/* KPI + ad thumbnail column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, width: 340 }}>
            {kpis.map((kpi, i) => {
              const kpiSp = spring({ frame: frame - i * 12 - kpiStartF, fps, config: { damping: 20, stiffness: 100 } });
              return (
                <div key={i} style={{
                  ...glass(C_ORANGE, 0.08),
                  padding: "18px 22px",
                  opacity: kpiSp,
                  transform: `translateX(${interpolate(kpiSp, [0, 1], [30, 0])}px)`,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div style={{ fontFamily: FONT, fontSize: 13, color: C_MUTED, letterSpacing: "0.06em" }}>
                    {kpi.label}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C_TEXT }}>
                      {kpi.prefix}
                      <AnimatedNumber value={kpi.value} frame={frame} startF={kpiStartF + i * 10} endF={kpiEndF} decimals={kpi.decimals} />
                      {kpi.suffix}
                    </span>
                    <span style={{ color: C_ORANGE, fontSize: 20, fontWeight: 700 }}>↑</span>
                  </div>
                </div>
              );
            })}

            {/* Ad creative thumbnail */}
            <div style={{
              ...glass(C_BLUE, 0.06),
              padding: "14px 18px",
              opacity: fadeIn(frame, 60, 80),
              display: "flex", gap: 14, alignItems: "center",
            }}>
              <div style={{
                width: 54, height: 54, borderRadius: 10, flexShrink: 0,
                background: `linear-gradient(135deg, ${C_BLUE}, ${C_ORANGE})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
              }}>📢</div>
              <div>
                <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C_TEXT }}>
                  Campaña Q2 — Activa
                </div>
                <div style={{ fontFamily: FONT, fontSize: 12, color: C_MUTED, marginTop: 3 }}>
                  $2,400 invertidos · 347 leads
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom label */}
      <div style={{
        position: "absolute", bottom: 130, left: 0, right: 0, textAlign: "center",
        fontFamily: FONT, fontWeight: 700, fontSize: 36, color: C_TEXT,
        opacity: fadeIn(frame, 30, 55),
        filter: `blur(${interpolate(fadeIn(frame, 30, 55), [0, 1], [6, 0])}px)`,
      }}>
        Ads que convierten.{" "}
        <span style={{ color: C_BLUE }}>Optimizados con IA.</span>
      </div>
    </AbsoluteFill>
  );
};

// ─── ToastCard ────────────────────────────────────────────────────────────
// Una notificación toast con spring desde abajo y glassmorphism.
const ToastCard: React.FC<{
  emoji: string; text: string; frame: number; startF: number; fps: number; accentColor?: string;
}> = ({ emoji, text, frame, startF, fps, accentColor = C_BLUE }) => {
  const sp = spring({ frame: frame - startF, fps, config: { damping: 16, stiffness: 120, mass: 0.9 } });
  return (
    <div style={{
      ...glass(accentColor, 0.14),
      padding: "16px 22px",
      borderLeft: `3px solid ${accentColor}`,
      display: "flex", alignItems: "center", gap: 14,
      opacity: sp,
      transform: `translateY(${interpolate(sp, [0, 1], [40, 0])}px) scale(${interpolate(sp, [0, 1], [0.94, 1])})`,
    }}>
      <span style={{ fontSize: 24 }}>{emoji}</span>
      <span style={{ fontFamily: FONT, fontSize: 16, color: C_TEXT, fontWeight: 500 }}>{text}</span>
    </div>
  );
};

// ─── SCENE 4 — Notificaciones de ventas (frames 450–600, 5 s) ────────────
// Panel de ventas en tiempo real: 4 toasts se apilan con stagger + spring,
// contador de ventas sube animado, indicador "escribiendo…" parpadea.
const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneIn = fadeIn(frame, 0, 22);
  const sceneOut = frame > 128 ? fadeOut(frame, 130, 148) : 1;
  const visible = sceneIn * sceneOut;

  const toasts = [
    { emoji: "💰", text: "Nueva venta — $1,250", color: "#10B981", startF: 15 },
    { emoji: "✨", text: "Nuevo lead — María G.", color: C_BLUE, startF: 30 },
    { emoji: "📈", text: "Conversión +12% hoy", color: C_ORANGE, startF: 45 },
    { emoji: "✅", text: "Cliente respondió", color: "#7C3AED", startF: 60 },
  ];

  const typingVisible = frame > 72;
  const typingDot = (delay: number) => Math.abs(Math.sin((frame - delay) / 12));
  const counterSp = spring({ frame, fps, config: { damping: 20, stiffness: 90 } });

  return (
    <AbsoluteFill style={{ opacity: visible, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
        {/* Left: sales counter card */}
        <div style={{
          ...glass(C_ORANGE, 0.18),
          width: 340, padding: "44px 36px",
          textAlign: "center",
          opacity: counterSp,
          transform: `scale(${interpolate(counterSp, [0, 1], [0.95, 1])})`,
        }}>
          <div style={{ fontFamily: FONT, fontSize: 15, color: C_MUTED, letterSpacing: "0.08em", marginBottom: 12 }}>
            VENTAS HOY
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 88, color: C_TEXT, lineHeight: 1 }}>
            <AnimatedNumber value={24} frame={frame} startF={10} endF={80} />
          </div>
          <div style={{
            marginTop: 14, fontFamily: FONT, fontSize: 15, color: "#10B981",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <span>↑</span>
            <AnimatedNumber value={34} frame={frame} startF={10} endF={80} />
            <span>% vs ayer</span>
          </div>
          <div style={{
            marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.07)",
            fontFamily: FONT, fontSize: 13, color: C_MUTED,
          }}>
            Revenue hoy
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C_ORANGE }}>
            $<AnimatedNumber value={18640} frame={frame} startF={10} endF={90} />
          </div>
        </div>

        {/* Right: toast notifications stack */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, width: 480 }}>
          {toasts.map((t, i) => (
            <ToastCard
              key={i} emoji={t.emoji} text={t.text}
              frame={frame} startF={t.startF} fps={fps} accentColor={t.color}
            />
          ))}

          {typingVisible && (
            <div style={{
              ...glass(C_MUTED, 0.05),
              padding: "14px 20px",
              display: "flex", alignItems: "center", gap: 10,
              opacity: fadeIn(frame, 72, 84),
            }}>
              <span style={{ fontFamily: FONT, fontSize: 14, color: C_MUTED }}>Lead escribiendo</span>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                {[0, 8, 16].map((d) => (
                  <div key={d} style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: C_MUTED, opacity: typingDot(d),
                  }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Label */}
      <div style={{
        position: "absolute", bottom: 130, left: 0, right: 0, textAlign: "center",
        fontFamily: FONT, fontWeight: 700, fontSize: 36, color: C_TEXT,
        opacity: fadeIn(frame, 20, 45),
        filter: `blur(${interpolate(fadeIn(frame, 20, 45), [0, 1], [6, 0])}px)`,
      }}>
        Resultados en{" "}
        <span style={{ color: C_ORANGE }}>piloto automático.</span>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 5 — Cierre / CTA (frames 600–720, 4 s) ─────────────────────────
// CREATRIX reaparece con glow intenso. CTA naranja "Hablemos →" y creatrix.ai.
const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const letters = "CREATRIX".split("");
  const glowIntensity = interpolate(frame, [0, 60], [0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaSp = spring({ frame: frame - 28, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", display: "flex", flexDirection: "column" }}>
      {/* Intense glow halo */}
      <div style={{
        position: "absolute", width: 800, height: 400,
        background: `radial-gradient(ellipse at center, rgba(37,99,235,${0.25 * glowIntensity}) 0%, rgba(255,107,44,${0.12 * glowIntensity}) 40%, transparent 70%)`,
        filter: "blur(60px)",
        transform: "translateY(-30px)",
      }} />

      {/* CREATRIX letters — blur-to-focus stagger */}
      <div style={{ display: "flex", gap: 6 }}>
        {letters.map((l, i) => {
          const delay = i * 3;
          const sp = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 130, mass: 0.7 } });
          return (
            <span key={i} style={{
              fontFamily: FONT, fontWeight: 800, fontSize: 112,
              letterSpacing: "0.08em", color: C_TEXT,
              opacity: sp,
              transform: `translateY(${interpolate(sp, [0, 1], [20, 0])}px)`,
              filter: `blur(${interpolate(sp, [0, 1], [10, 0])}px)`,
              display: "inline-block", lineHeight: 1,
              textShadow: `0 0 ${40 * glowIntensity}px rgba(37,99,235,0.6)`,
            }}>
              {l}
            </span>
          );
        })}
      </div>

      {/* Tagline */}
      <div style={{
        fontFamily: FONT, fontWeight: 700, fontSize: 38, color: C_TEXT,
        marginTop: 16, opacity: fadeIn(frame, 18, 38),
        transform: `translateY(${interpolate(fadeIn(frame, 18, 38), [0, 1], [12, 0])}px)`,
      }}>
        Más leads.{" "}
        <span style={{ color: C_MUTED, fontWeight: 400 }}>Menos esfuerzo.</span>
      </div>

      {/* CTA pill button */}
      <div style={{
        marginTop: 40,
        opacity: fadeIn(frame, 28, 50),
        transform: `translateY(${interpolate(fadeIn(frame, 28, 50), [0, 1], [16, 0])}px) scale(${interpolate(ctaSp, [0, 1], [0.92, 1])})`,
      }}>
        <div style={{
          background: C_ORANGE,
          borderRadius: 44, padding: "18px 52px",
          fontFamily: FONT, fontWeight: 700, fontSize: 22, color: "#fff",
          letterSpacing: "0.02em",
          boxShadow: `0 0 40px rgba(255,107,44,0.45), 0 8px 24px rgba(255,107,44,0.3)`,
          display: "inline-block",
        }}>
          Hablemos →
        </div>
      </div>

      {/* Domain */}
      <div style={{
        marginTop: 22,
        opacity: fadeIn(frame, 42, 62) * 0.5,
        fontFamily: FONT, fontSize: 17, color: C_TEXT, letterSpacing: "0.1em",
      }}>
        creatrix.ai
      </div>
    </AbsoluteFill>
  );
};

// ─── CreatrixPromo — composición principal ────────────────────────────────
// 1920×1080 · 30 fps · 720 frames (24 s).
// Cada escena vive en su propio <Sequence> para timing limpio y aislado.
export const CreatrixPromo: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Fondo animado visible durante toda la duración */}
      <BackgroundGlow />

      {/* Escena 1: Intro con letras blur-to-focus (0–3 s) */}
      <Sequence from={0} durationInFrames={90}>
        <Scene1 />
      </Sequence>

      {/* Escena 2: Canvas de automatización tipo Zapier (3–9 s) */}
      <Sequence from={90} durationInFrames={180}>
        <Scene2 />
      </Sequence>

      {/* Escena 3: Dashboard de ads con barras y KPIs animados (9–15 s) */}
      <Sequence from={270} durationInFrames={180}>
        <Scene3 />
      </Sequence>

      {/* Escena 4: Panel de ventas con notificaciones toast (15–20 s) */}
      <Sequence from={450} durationInFrames={150}>
        <Scene4 />
      </Sequence>

      {/* Escena 5: Cierre premium con CTA (20–24 s) */}
      <Sequence from={600} durationInFrames={120}>
        <Scene5 />
      </Sequence>
    </AbsoluteFill>
  );
};
