import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Import my own files
import HomeScreen from './Homescreen.js';
import SettingsScreen from './Settings.js';
import ProfileScreen from './Profile.js';

const getData = async (done) => {
  try {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details')
    const data = JSON.parse(jsonValue);
    return done(data);
  } catch (e) {
    console.error(e);
  }
}

const Drawer = createDrawerNavigator();

class DrawerScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login_info: {},
      isLoading: true
    }
  }

  componentDidMount() {
    getData((data) => {
      this.setState({
        login_info: data,
        isLoading: false
      });
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View><Text>Loading...</Text></View>
      )
    } else {
      return (
        <Drawer.Navigator
          drawerPosition="right">
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Settings" component={SettingsScreen} />
          <Drawer.Screen name="Profile" component={ProfileScreen} />
          {/* <Drawer.Screen name="Log Out" component={ProfileScreen} /> */}
        </Drawer.Navigator>

      )
    }
  }

}

export default DrawerScreen;