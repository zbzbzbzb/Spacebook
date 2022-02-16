import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//Import my own files
import EditProfileScreen from './EditProfile.js';
import EditProfilePhotoScreen from './EditProfilePhoto.js';
import MyProfileScreen from './MyProfile.js';

const Stack = createStackNavigator();

class ProfileScreen extends Component {
   render() {
    console.log('Profile');

      return (

          <Stack.Navigator
            screenOptions={{
              headerShown: false
            }}
          >
            <Stack.Screen name="My Profile" component={MyProfileScreen} />
            <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
            <Stack.Screen name="Edit Profile Photo" component={EditProfilePhotoScreen} />
          </Stack.Navigator>
      );
    
  }
}
export default ProfileScreen;
