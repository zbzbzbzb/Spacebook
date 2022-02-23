import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FRScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      friendRequestData: [],
    };
  }

  componentDidMount() {
    this.getFriendRequestsData();
  }

  getFriendRequestsData = async () => {
    let jsonValue = await AsyncStorage.getItem('@spacebook_details');console.log(jsonValue);
    let user_data = JSON.parse(jsonValue);console.log(user_data);
    return fetch(global.srv_url + "/friendrequests",{
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
          friendRequestData: responseJson
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    console.log('Friend requests');
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
          <Fragment>
          <FlatList
            data={this.state.friendRequestData}
            renderItem={({ item }) =>
              <TouchableOpacity>
                <View >
                  <View >
                    <Text>{item.first_name} {item.last_name}</Text>
                  </View>
                  <View>
                    <Text>Accept</Text>
                    <Text>Reject</Text>
                  </View>
                </View>
              </TouchableOpacity>
            }
            keyExtractor={item => item.user_id}
          />
          </Fragment>
        </View>


      );
    }
  }
}
export default FRScreen;


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