import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

//https://www.npmjs.com/package/react-native-vector-icons
//Entypo

//Import my own files
import LoginScreen from './Pages/Login.js';
import DrawerScreen from './Pages/DrawerScreen.js';
import SignUpScreen from './Pages/SignUpScreen.js';

global.srv_url = "http://localhost:3333/api/1.0.0"

const Stack = createStackNavigator();

export default function App() {
  console.log("App");

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Drawer" component={DrawerScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/*
npm install @react-navigation/material-top-tabs react-native-tab-view

npm install react-native-pager-view
*/
/*
zfbobat@gmail.co.uk
zahir123
*/