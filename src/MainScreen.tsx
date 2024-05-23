import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

function MainScreen({ hasPermission }: { hasPermission: boolean }) {
  const device = useCameraDevice('front');

  return (
    <View style={StyleSheet.absoluteFill}>
      {!hasPermission && <Text>No Camera Permission.</Text>}
      {hasPermission && device != null && (
        <View style={{ flex: 1 }}>
          <Camera style={StyleSheet.absoluteFill} device={device} isActive />
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
