import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";

export const canvas = {
  width: 1080,
  height: 1920,
  fps: 30,
};

export const colors = {
  bg: "#050A07",
  panel: "#0A1610",
  green: "#00FF88",
  greenGlow: "#5BFFB3",
  greenDeep: "#0EA86A",
  red: "#FF2D2D",
  redGlow: "#FF6B6B",
  text: "#EAFFF3",
  textMuted: "#6E9A82",
};

const { fontFamily: interFontFamily } = loadInter("normal", {
  weights: ["400", "600", "700", "800"],
});

const { fontFamily: jetBrainsMonoFontFamily } = loadJetBrainsMono("normal", {
  weights: ["400", "600", "700", "800"],
});

export const fonts = {
  inter: interFontFamily,
  mono: jetBrainsMonoFontFamily,
};

export const glow = (color: string, intensity: number = 1) => ({
  textShadow: `0 0 ${4 * intensity}px ${color}, 0 0 ${12 * intensity}px ${color}, 0 0 ${24 * intensity}px ${color}`,
  filter: `drop-shadow(0 0 ${6 * intensity}px ${color})`,
});

export const boxGlow = (color: string, intensity: number = 1) => ({
  boxShadow: `0 0 ${4 * intensity}px ${color}, 0 0 ${16 * intensity}px ${color}, 0 0 ${32 * intensity}px ${color}`,
});
