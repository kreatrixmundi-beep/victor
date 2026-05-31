import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const HelloWorld: React.FC<{ titleText: string; titleColor: string }> = ({
  titleText,
  titleColor,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [durationInFrames - 25, durationInFrames - 15], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const slideIn = interpolate(frame, [0, 20], [-200, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0b84f3",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${slideIn}px)`,
          fontFamily: "Helvetica, Arial, sans-serif",
          fontSize: 80,
          textAlign: "center",
          color: titleColor,
        }}
      >
        {titleText}
      </div>
    </AbsoluteFill>
  );
};
