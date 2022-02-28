import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

//Import my own files
import MyFriendsScreen from './MyFriendsScreen.js';
import FriendsProfile from './FriendsProfile.js';

const Stack = createStackNavigator();

export default function ShowFriendsNav() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="My Friends" component={MyFriendsScreen} />
        <Stack.Screen name="FriendsProfile" component={FriendsProfile} />
    </Stack.Navigator>    
    );
}
