import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

//Import my own files
import {HomeScreen} from './Pages/Homescreen.js' ;
import {SettingsScreen} from './Pages/Settings.js' ;
import {ProfileScreen} from './Pages/Profile.js' ;

function homeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home screen!</Text>
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="Home" component={homeScreen} />
          <Drawer.Screen name="Home" component={SettingsScreen} />
          <Drawer.Screen name="Home" component={ProfileScreen} />
        </Drawer.Navigator>
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


