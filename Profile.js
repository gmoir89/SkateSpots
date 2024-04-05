import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>SkateSpots</Text>
      <Image
        source={require('./assets/skate.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.subheader}>A Rad App for Rad Peeps</Text>
    </View>
  );
}

// Define styles outside of the component for better performance and readability
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, // Apply equal padding around the container
  },
  header: {
    fontSize: 24, // Adjust font size as needed
    fontWeight: 'bold', // Make the header bold
    marginBottom: 20, // Add space below the header
    textAlign: 'center', // Center the text horizontally
  },
  subheader: {
    fontSize: 18, // Adjust font size as needed
    marginTop: 20, // Add space above the subheader
    textAlign: 'center', // Center the text horizontally
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default Profile;