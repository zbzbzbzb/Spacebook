import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Import my own files
import AddPostScreen from './AddPost.js';
import FriendScreen from './Friends.js';
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

const Tab = createBottomTabNavigator();

class HomeScreen extends Component {
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
    console.log("HomeScreen");
    if (this.state.isLoading) {
      return (
        <View><Text>Loading...</Text></View>
      )
    } else {


      return (
        <Tab.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          <Tab.Screen name="Friends" component={FriendScreen} />
          <Tab.Screen name='Post' component={AddPostScreen} />
          <Tab.Screen name='Profile' component={ProfileScreen} />
        </Tab.Navigator>
      );

    }
  }
}

export default HomeScreen;