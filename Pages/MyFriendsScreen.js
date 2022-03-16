import React, {Component} from 'react';
import {View, Button, ActivityIndicator, FlatList, TouchableOpacity, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScrollView} from 'react-native-gesture-handler';
import {InnerStyledView, SplitView, NameText} from '../style.js';
import AwesomeAlert from 'react-native-awesome-alerts';

class MyFriendsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      myFriendsData: [],
      showAlert: false,
      alertError: '',
    };
  }

  componentDidMount() {
    this.getMyFriendsData();
  }

  viewFriend = (id) => {
    this.props.navigation.navigate('Friends Profile', {
      friend_id: id,
    });
  };

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
  getMyFriendsData = async () => {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details');
    const userData = JSON.parse(jsonValue);
    return fetch(global.srv_url + '/user/' + userData['id'] + '/friends', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': userData['token'],
      },
    })
        .then((response) => response)
        .then((data) => {
          if (data.status == 200) {
            data.json().then((json) =>{
              json.forEach((element, index) => {
                this.getPhoto(element.user_id, index);
              });
              this.setState({
                isLoading: false,
                myFriendsData: json,
              });
            });
          } else {
            let text;
            switch (json.status) {
              case 401:
                text = 'You are not logged in';
                break;
              case 403:
                text = 'You can only view your friends';
                break;
              case 404:
                text = 'Not Found';
                break;
              case 500:
                text = 'A Server Error has occurred';
                break;
            }
            this.setState({
              alertError: text,
            });
            this.showAlert();
          }
        })
        .catch((error) => {
          console.log(error);
        });
  };

  getPhoto = async (friendsUserId, index) => {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details');
    const userData = JSON.parse(jsonValue);
    fetch(global.srv_url + '/user/' + friendsUserId + '/photo', {
      method: 'GET',
      headers: {
        'X-Authorization': userData['token'],
      },
    })
        .then((res) => {
          return res.blob();
        })
        .then((resBlob) => {
          const data = URL.createObjectURL(resBlob);
          myFriendsData[index]['profile_photo'] = data;
        })
        .catch((err) => {
          console.log('error', err);
        });
  };

  render() {
    console.log('MyFriends');
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
            data={this.state.myFriendsData}
            renderItem={({item}) =>
              <TouchableOpacity>
                <InnerStyledView>
                  <SplitView>
                    <Image
                      source={{
                        uri: item.profile_photo,
                      }}
                      style={{
                        width: 80,
                        height: 80,
                        borderWidth: 2,
                      }}
                    />
                    <View>
                      <NameText>{item.user_givenname} {item.user_familyname}</NameText>
                    </View>
                  </SplitView>
                  <View>
                    <Button
                      title="View"
                      onPress={() => this.viewFriend(item.user_id)}
                    />
                  </View>
                </InnerStyledView>
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
export default MyFriendsScreen;

/* MyFRIENDS
GET
/user/{user_id}/friends
Get list of friends for a given user

*/
