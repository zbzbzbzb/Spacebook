import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//Import my own files
import FeedScreen from './Feed.js' ;
import CameraScreen from './Camera.js' ;

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  return (
        <Tab.Navigator >
            <Tab.Screen name="Feed" component={FeedScreen} />
            <Tab.Screen name='Camera' component={CameraScreen}/>
        </Tab.Navigator>
  );

}