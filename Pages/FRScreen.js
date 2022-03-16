import React, {Component, Fragment} from 'react';
import {Text, View, Button, ActivityIndicator, FlatList, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';

class FRScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      friendRequestData: [],
      showAlert: false,
      alertError: '',
    };
  }

  componentDidMount() {
    this.getFriendRequestsData();
  }

  showAlert = () => {
    this.setState({
      showAlert: true,
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

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
          let text;
          switch (response.status) {
            case 200:
              if (methodType == 'POST') {
                text = 'Friend Request Accepted';
              } else if (methodType = 'DELETE') {
                text = 'Friend Request Rejected';
              }
              break;
            case 400:
              text = 'User was not edited - Please check your inputs';
              break;
            case 401:
              text = 'You are not logged in';
              break;
            case 403:
              text = 'Forbidden Request';
              break;
            case 500:
              text = 'A Server Error has occurred';
              break;
          }
          this.setState({
            alertError: text,
          });
          this.showAlert();
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
    const {showAlert} = this.state;
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
              ListFooterComponent={
                <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title={this.state.alertError}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={true}
                confirmText="Ok"
                confirmButtonColor="#DD6B55"
                onConfirmPressed={() => {
                  this.hideAlert();
                }}
              />
              }
            />

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
