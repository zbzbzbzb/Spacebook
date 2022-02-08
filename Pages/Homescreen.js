import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//Import my own files
import FeedScreen from './Feed.js';
import CameraScreen from './Camera.js';
import FriendScreen from './Friends.js';

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  console.log("Home");
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Friends" component={FriendScreen} />
      <Tab.Screen name='Camera' component={CameraScreen} />
    </Tab.Navigator>
  );

}