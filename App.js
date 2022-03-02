import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet} from 'react-native';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

//https://www.npmjs.com/package/react-native-vector-icons
//Entypo
//https://www.npmjs.com/package/react-native-awesome-alerts#installation

//Import my own files
import LoginScreen from './Pages/Login.js';
import Homescreen from './Pages/Homescreen.js';
import SignUpScreen from './Pages/SignUpScreen.js';

// global.srv_url = "http://192.168.68.134:3333/api/1.0.0";
//global.srv_url = "http://192.168.89.232:3333/api/1.0.0";
 global.srv_url = "http://localhost:3333/api/1.0.0";

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
        <Stack.Screen name="Homescreen" component={Homescreen} />
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