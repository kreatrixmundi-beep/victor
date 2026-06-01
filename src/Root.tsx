import React from "react";
import { Composition } from "remotion";
import { CreatrixPromo } from "./CreatrixPromo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CreatrixPromo"
        component={CreatrixPromo}
        durationInFrames={540}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
