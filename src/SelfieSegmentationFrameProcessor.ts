import { useTensorflowModel } from 'react-native-fast-tflite';
import { Frame, useSkiaFrameProcessor } from 'react-native-vision-camera';
import { useResizePlugin } from 'vision-camera-resize-plugin';

export const useFrameSelfieSegmentation = () => {
  const tf = useTensorflowModel(require('../assets/selfie_segmenter.tflite'));
  const { resize } = useResizePlugin();

  const segment = (frame: Frame) => {
    'worklet';
    if (tf.state !== 'loaded' || tf.model === undefined) {
      return null;
    }

    const resizedFrame = resize(frame, {
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
    const output: any[] = tf.model.runSync([resizedFrame]);

    return output[0];
  };

  const frameProcessor = useSkiaFrameProcessor((frame) => {
    'worklet';

    const mask = segment(frame);

    if (mask !== null) {
      console.log(mask.length);
    }

    frame.render();
  }, []);

  return { frameProcessor };
};
