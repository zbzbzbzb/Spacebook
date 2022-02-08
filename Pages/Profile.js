import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: '222px' }}>
      <Text>Profile!</Text>
    </View>
  );
}


/*
GET
/user/{user_id}
Get user information

PATCH
/user/{user_id}
Update user information

GET
/user/{user_id}/photo
Get a users profile photo

POST
/user/{user_id}/photo
Upload a profile photo
*/