import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons for the camera icons
import * as Haptics from 'expo-haptics'; // Import Haptics for camera button feedback

function Feed({ onPictureTaken }) {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef.current && locationPermission.granted) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (!photo) {
          console.error('Photo is null or undefined');
          return;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Provide haptic feedback
        console.log('Photo taken:', photo.uri);

        const location = await Location.getCurrentPositionAsync({});
        console.log('Location data:', location);

        const filename = `photo_${Date.now()}.jpg`;
        const fileUri = FileSystem.documentDirectory + filename;

        await FileSystem.copyAsync({
          from: photo.uri,
          to: fileUri,
        });
        console.log('Photo saved to:', fileUri);

        onPictureTaken({ fileUri, location });
      } catch (error) {
        console.error('Error taking picture or fetching location:', error);
      }
    } else {
      console.error('Camera ref is null or location permission is not granted');
    }
  };

  if (!permission || !locationPermission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  if (!locationPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to access your location</Text>
        <Button onPress={requestLocationPermission} title="Grant Location Permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef} onCameraReady={setupPinchToZoom}>
        <View style={styles.buttonContainer}>
          {/* Move buttons to the bottom */}
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <MaterialIcons name="flip-camera-ios" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <MaterialIcons name="camera" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );

  function setupPinchToZoom() {

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginTop: 'auto', // Adjusted to move to the bottom
    padding: 20, // Add some padding at the bottom
  },
  button: {
    marginHorizontal: 20,
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
  },
});

export default Feed;