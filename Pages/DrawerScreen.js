import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

//Import my own files
import HomeScreen from './Homescreen.js' ;
import SettingsScreen from './Settings.js' ;
import ProfileScreen from './Profile.js' ;

const Drawer = createDrawerNavigator();

export default function DrawerScreen() {

  return (
        <Drawer.Navigator>
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Settings" component={SettingsScreen} />
          <Drawer.Screen name="Profile" component={ProfileScreen} />
        </Drawer.Navigator>
  );
}