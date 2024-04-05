import React from 'react';
import { View, Image } from 'react-native';

function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={require('./assets/skate.png')}
        style={{ width: 200, height: 200 }} // Set the width and height as needed
        resizeMode="contain" // This makes sure the whole image fits into the designated space
      />
    </View>
  );
}

export default Profile;
