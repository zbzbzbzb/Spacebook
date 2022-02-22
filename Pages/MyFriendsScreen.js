import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class MyFriendsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      myFriendsData: [],
    };
  }

  componentDidMount() {
    this.getMyFriendsData();
  }

  getMyFriendsData = async () => {
    let jsonValue = await AsyncStorage.getItem('@spacebook_details');console.log(jsonValue);
    let user_data = JSON.parse(jsonValue);console.log(user_data);
    return fetch(global.srv_url + "/user/" + user_data['id'] + "/friends",{
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
          myFriendsData: responseJson
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    console.log('MyFriends');
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
          <FlatList
            data={this.state.myFriendsData}
            renderItem={({ item }) =>
              <TouchableOpacity>
                <View >
                  <View >
                    <Text>{item.first_name} {item.last_name}</Text>
                  </View>
                  <View>
                    <Text >Post</Text>
                  </View>
                </View>
              </TouchableOpacity>
            }
            keyExtractor={item => item.id}
          />
        </View>


      );
    }
  }
}
export default MyFriendsScreen;

/* MyFRIENDS
GET
/user/{user_id}/friends
Get list of friends for a given user

*/