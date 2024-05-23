import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

import { useFrameSelfieSegmentation } from './SelfieSegmentationFrameProcessor';

function MainScreen({ hasPermission }: { hasPermission: boolean }) {
  const device = useCameraDevice('front');

  const { frameProcessor } = useFrameSelfieSegmentation();

  return (
    <View style={StyleSheet.absoluteFill}>
      {!hasPermission && <Text>No Camera Permission.</Text>}
      {hasPermission && device != null && (
        <View style={{ flex: 1 }}>
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive
            frameProcessor={frameProcessor}
          />
        </View>
      )}
    </View>
  );
}

export default function MainScreenAskingForPermission() {
  const [hasPermission, setHasPermission] = useState(false);
  useEffect(() => {
    Camera.requestCameraPermission().then((p) =>
      setHasPermission(p === 'granted')
    );
  }, []);

  return <MainScreen hasPermission={hasPermission} />;
}
