import React from 'react';
import { Sequence } from 'remotion';
import { Escena1Fiesta } from './scenes/Escena1Fiesta';
import { Escena2Netflix } from './scenes/Escena2Netflix';
import { Escena3Balcon } from './scenes/Escena3Balcon';
import { Escena4Espejo } from './scenes/Escena4Espejo';

export const MainSequence: React.FC = () => {
  return (
    <>
      <Sequence from={0} durationInFrames={150}>
        <Escena1Fiesta />
      </Sequence>
      <Sequence from={150} durationInFrames={150}>
        <Escena2Netflix />
      </Sequence>
      <Sequence from={300} durationInFrames={150}>
        <Escena3Balcon />
      </Sequence>
      <Sequence from={450} durationInFrames={150}>
        <Escena4Espejo />
      </Sequence>
    </>
  );
};
