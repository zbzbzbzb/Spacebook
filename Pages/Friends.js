import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

//Import my own files
import ShowFriendsNav from './ShowFriendsNav.js';
import FRScreen from './FRScreen.js';
import SearchScreen from './SearchScreen.js';

const Tab = createMaterialTopTabNavigator();

export default function FriendScreen() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="ShowFriendsNav" component={ShowFriendsNav} />
        <Tab.Screen name="Friend Requests" component={FRScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
    </Tab.Navigator>    
    );
}


/*
PAGE STRUCTURE

Tabs
MyFriends - FR's - Search

*/