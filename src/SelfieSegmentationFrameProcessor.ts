import { useSkiaFrameProcessor } from 'react-native-vision-camera';

export const useFrameSelfieSegmentation = () => {
  const frameProcessor = useSkiaFrameProcessor((frame) => {
    'worklet';

    frame.render();
  }, []);

  return { frameProcessor };
};
