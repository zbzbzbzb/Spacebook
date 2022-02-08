import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function FriendScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Friends!</Text>
      </View>
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