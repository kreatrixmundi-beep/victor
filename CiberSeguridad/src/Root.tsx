import React from 'react';
import { Composition } from 'remotion';
import { HelloWorld } from './HelloWorld';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          titleText: 'CiberSeguridad',
          titleColor: '#00e0ff',
        }}
      />
    </>
  );
};
