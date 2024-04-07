import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Image } from 'react-native';
import Feed from './Feed';
import Notifications from './Notifications';
import Profile from './Profile';
import homeIcon from './assets/home.png';
import cameraIcon from './assets/camera.png';
import locationIcon from './assets/location.png';

const Tab = createMaterialBottomTabNavigator();

const tabBarColors = {
  Profile: '#FF6347', // Tomato
  Feed: '#4682B4', // SteelBlue
  Notifications: '#32CD32', // LimeGreen
};

export default function App() {
  const [savedPhotoData, setSavedPhotoData] = useState([]);
  const [activeTabColor, setActiveTabColor] = useState(tabBarColors.Profile); // Initial tab bar color

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
    <NavigationContainer onStateChange={(state) => {
      const routeName = state.routes[state.index].name;
      setActiveTabColor(tabBarColors[routeName]);
    }}>
      <Tab.Navigator
        initialRouteName="Profile"
        activeColor="#000000" // Icons and text color in active state
        inactiveColor="#000000" // Icons and text color in inactive state
        barStyle={{ backgroundColor: activeTabColor }} // Dynamic background color based on the active tab
      >
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color }) => (
              <Image source={homeIcon} style={{ width: 26, height: 26, tintColor: color }} />
            ),
          }}
        />
        <Tab.Screen
          name="Feed"
          children={() => <Feed onPictureTaken={handlePictureTaken} />}
          options={{
            tabBarIcon: ({ color }) => (
              <Image source={cameraIcon} style={{ width: 26, height: 26, tintColor: color }} />
            ),
          }}
        />
        <Tab.Screen
          name="Notifications"
          children={() => <Notifications savedPhotoUris={savedPhotoData} onDelete={handleDelete} onUpdate={handleUpdate} />}
          options={{
            tabBarIcon: ({ color }) => (
              <Image source={locationIcon} style={{ width: 26, height: 26, tintColor: color }} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}