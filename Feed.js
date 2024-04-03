import React, { useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';

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
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
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
    marginBottom: 20,
  },
  button: {
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Feed;