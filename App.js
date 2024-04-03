import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Feed from './Feed';
import Notifications from './Notifications';
import Profile from './Profile';

const Tab = createMaterialBottomTabNavigator();

export default function App() {
  const [savedPhotoData, setSavedPhotoData] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const photosJson = await AsyncStorage.getItem('savedPhotos');
      if (photosJson) {
        const photos = JSON.parse(photosJson);
        console.log('Fetched photos from AsyncStorage:', photos);
        setSavedPhotoData(photos);
      }
    };

    fetchPhotos();
  }, []);

  const handlePictureTaken = async ({ fileUri, location }) => {
    const updatedPhotoData = [...savedPhotoData, { fileUri, location, description: '' }];
    setSavedPhotoData(updatedPhotoData);
    await AsyncStorage.setItem('savedPhotos', JSON.stringify(updatedPhotoData));
  };

  const handleDelete = async (fileUri) => {
    const updatedPhotoData = savedPhotoData.filter(photo => photo.fileUri !== fileUri);
    setSavedPhotoData(updatedPhotoData);
    await AsyncStorage.setItem('savedPhotos', JSON.stringify(updatedPhotoData));
  };

  const handleUpdate = async (fileUri, newDescription) => {
    const updatedPhotoData = savedPhotoData.map(photo => {
      if (photo.fileUri === fileUri) {
        return { ...photo, description: newDescription };
      }
      return photo;
    });
    setSavedPhotoData(updatedPhotoData);
    await AsyncStorage.setItem('savedPhotos', JSON.stringify(updatedPhotoData));
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Profile"
        activeColor="#e91e63"
        labelStyle={{ fontSize: 12 }}
        style={{ backgroundColor: 'tomato' }}>
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" color={color} size={26} />,
          }}
        />
        <Tab.Screen
          name="Feed"
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" color={color} size={26} />,
          }}>
          {() => <Feed onPictureTaken={handlePictureTaken} />}
        </Tab.Screen>
        <Tab.Screen
          name="Notifications"
          options={{
            tabBarLabel: 'Updates',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="bell" color={color} size={26} />,
          }}>
          {() => <Notifications savedPhotoUris={savedPhotoData} onDelete={handleDelete} onUpdate={handleUpdate} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}