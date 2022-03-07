import React, {Component, Fragment} from 'react';
import {Text, View, Button, ActivityIndicator, FlatList, TouchableOpacity} from 'react-native';
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

  handleFR = async (friendId, methodType) => {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details');
    const userData = JSON.parse(jsonValue);

    return fetch(global.srv_url + '/friendrequests/' + friendId, {
      method: methodType,
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': userData['token'],
      },
    })
        .then((response) => {
          if (methodType == 'POST') {
            console.log('Friend Request Accepted');
          } else if (methodType = 'DELETE') {
            console.log('Friend Request Rejected');
          }
        }).then(() => {
          this.getFriendRequestsData();
        })
        .catch((err) => {
          console.log(err);
        });
  };

  getFriendRequestsData = async () => {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details');
    const userData = JSON.parse(jsonValue);
    return fetch(global.srv_url + '/friendrequests', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': userData['token'],
      },
    })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          this.setState({
            isLoading: false,
            friendRequestData: responseJson,
          });
        })
        .catch((error) => {
          console.log(error);
        });
  };

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
              renderItem={({item}) =>
                <TouchableOpacity>
                  <View >
                    <View >
                      <Text>{item.first_name} {item.last_name}</Text>
                    </View>
                    <View>
                      <Button
                        title="Accept"
                        onPress={() => this.handleFR(item.user_id, 'POST')}
                      />
                      <Button
                        title="Reject"
                        onPress={() => this.handleFR(item.user_id, 'DELETE')}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              }
              keyExtractor={(item) => item.user_id}
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
