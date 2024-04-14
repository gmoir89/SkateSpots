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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, 
  },
  header: {
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center',
  },
  subheader: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default Profile;