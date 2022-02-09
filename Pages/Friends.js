import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

//Import my own files
import MyFriendsScreen from './MyFriendsScreen.js';
import FRScreen from './FRScreen.js';
import SearchScreen from './SearchScreen.js';

const Tab = createMaterialTopTabNavigator();

export default function FriendScreen() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="My Friends" component={MyFriendsScreen} />
        <Tab.Screen name="Friend Requests" component={FRScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
    </Tab.Navigator>    
    );
}


/*
PAGE STRUCTURE

Tabs
Friends - FR's - Search

*/

/* FRIENDS
GET
/user/{user_id}/friends
Get list of friends for a given user

*/

/*  FR

GET
/friendrequests
Get list of outstanding friends requests

POST
/friendrequests/{user_id}
Accept a friend request

DELETE
/friendrequests/{user_id}
Reject a friend request

*/

/*  SEARCH

POST
/user/{user_id}/friends
Add a new friend

GET
/search
Find friends
*/