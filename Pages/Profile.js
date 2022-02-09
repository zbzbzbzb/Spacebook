import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      profileData: [],
    };
  }

  componentDidMount() {
    this.getProfileData();
    //this.getPhotoData();
  }

  getProfileData = async () => {
    let jsonValue = await AsyncStorage.getItem('@spacebook_details');console.log(jsonValue);
    let user_data = JSON.parse(jsonValue);console.log(user_data);
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_data['id'],{
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': user_data['token']
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
          profileData: responseJson
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    console.log('Profile');
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator
            size="large"
            color="#00ff00"
          />
        </View>
      );
    } else {
      return (
          <View>
            <Text>{this.state.profileData.email}</Text>
            <Text>{this.state.profileData.first_name}</Text>
            <Text>{this.state.profileData.last_name}</Text>
            <Text>{this.state.profileData.friend_count}</Text>
          </View>
      );
    }
  }
}
export default ProfileScreen;

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