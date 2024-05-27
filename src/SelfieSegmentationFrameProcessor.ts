import {
  AlphaType,
  BlendMode,
  ColorType,
  Skia,
  SkRect,
  TileMode,
} from '@shopify/react-native-skia';
import { useCallback } from 'react';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { Frame, useSkiaFrameProcessor } from 'react-native-vision-camera';
import { useResizePlugin } from 'vision-camera-resize-plugin';

export const useFrameSelfieSegmentation = () => {
  const tf = useTensorflowModel(
    require('../assets/selfie_segmenter.tflite'),
    'default'
  );
  const { resize } = useResizePlugin();

  console.log(tf);

  const segment = useCallback(
    (frame: Frame) => {
      'worklet';
      if (tf.state !== 'loaded' || tf.model === undefined) {
        console.log('MODEL not loaded');
        return null;
      }

      const resized = resize(frame, {
        scale: {
          width: 256,
          height: 256,
        },
        crop: {
          x: 0,
          y: 0,
          width: frame.width,
          height: frame.height,
        },
        pixelFormat: 'rgb',
        dataType: 'float32',
      });

      const output: any[] = tf.model.runSync([resized]);

      return output[0];
    },
    [tf, resize]
  );

  const frameProcessor = useSkiaFrameProcessor(
    (frame) => {
      'worklet';

      const paintBlur = Skia.Paint();
      const filterBlur = Skia.ImageFilter.MakeBlur(
        50,
        50,
        TileMode.Clamp,
        null
      );
      paintBlur.setImageFilter(filterBlur);
      frame.render(paintBlur);

      const mask = segment(frame);

      if (mask == null) {
        return;
      }

      const data = Skia.Data.fromBytes(mask);

      const maskImage = Skia.Image.MakeImage(
        {
          width: 256,
          height: 256,
          alphaType: AlphaType.Opaque,
          colorType: ColorType.Alpha_8,
        },
        data,
        256
      );
      if (maskImage == null) {
        return;
      }

      const srcRect: SkRect = { x: 0, y: 0, width: 256, height: 256 };

      const dstRect: SkRect = {
        x: 0,
        y: 0,
        width: frame.width,
        height: frame.height,
      };

      const maskPaint = Skia.Paint();
      maskPaint.setBlendMode(BlendMode.SrcOver);

      frame.drawImageRect(maskImage, srcRect, dstRect, maskPaint);
    },
    [segment]
  );

  return { frameProcessor };
};
