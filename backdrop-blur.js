import React from 'react';
import * as RN from 'react-native';
import {
  Canvas,
  Fill,
  Image,
  BackdropBlur,
  ColorMatrix,
  useImage,
} from '@shopify/react-native-skia';

export default function Backdrop(props) {
  const image = useImage(require('./test.jpg'));

  if (!image) {
    return null;
  }

  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Image image={image} x={0} y={0} width={256} height={256} fit="cover" />
      <BackdropBlur blur={8} clip={{ x: 0, y: 0, width: 256, height: 256 }}>
        <Fill color="rgba(0, 0, 0, 0.2)" />
      </BackdropBlur>
    </Canvas>
  );
}
