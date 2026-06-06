import React from 'react';
import { Composition } from 'remotion';
import { MainSequence } from './MainSequence';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="andres-historia"
        component={MainSequence}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
