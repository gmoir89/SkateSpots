import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

function Notifications({ savedPhotoUris }) {
  console.log('Rendering URIs in Notifications:', savedPhotoUris);
  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
      <Text>Notifications!</Text>
      {savedPhotoUris.map(uri => (
        <Image key={uri} source={{ uri }} style={{ width: 200, height: 200, marginTop: 20 }} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});

export default Notifications;