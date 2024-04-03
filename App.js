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
  const [savedPhotoUris, setSavedPhotoUris] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const photosJson = await AsyncStorage.getItem('savedPhotos');
      if (photosJson) {
        const photos = JSON.parse(photosJson);
        console.log('Fetched photos from AsyncStorage:', photos); // Add this log
        setSavedPhotoUris(photos);
      }
    };
  
    fetchPhotos();
  }, []);

  const handlePictureTaken = async (uri) => {
    const updatedPhotoUris = [...savedPhotoUris, uri];
    console.log('Updated photo URIs:', updatedPhotoUris); // Add this log
    setSavedPhotoUris(updatedPhotoUris);
    await AsyncStorage.setItem('savedPhotos', JSON.stringify(updatedPhotoUris));
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
          {/* Use children prop instead of component for Feed */}
          {() => <Feed onPictureTaken={handlePictureTaken} />}
        </Tab.Screen>
        <Tab.Screen
          name="Notifications"
          options={{
            tabBarLabel: 'Updates',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="bell" color={color} size={26} />,
          }}>
          {/* Use children prop instead of component for Notifications */}
          {() => <Notifications savedPhotoUris={savedPhotoUris} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}