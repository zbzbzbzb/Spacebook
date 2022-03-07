import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

// Import my own files
import EditProfileScreen from './EditProfile.js';
import EditProfilePhotoScreen from './EditProfilePhoto.js';
import MyProfileScreen from './MyProfile.js';
import EditPostScreen from './EditPostScreen.js';

const Stack = createStackNavigator();

class ProfileScreen extends Component {
  render() {
    console.log('Profile');

    return (
      <Stack.Navigator>
        <Stack.Screen name="My Profile" component={MyProfileScreen} />
        <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
        <Stack.Screen name="Edit Profile Photo" component={EditProfilePhotoScreen} />
        <Stack.Screen name="Edit Post" component={EditPostScreen} />
      </Stack.Navigator>
    );
  }
}
export default ProfileScreen;
