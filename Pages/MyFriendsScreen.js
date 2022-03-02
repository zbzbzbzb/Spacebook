import React, { Component } from 'react';
import { Text, View, Button, ActivityIndicator, FlatList, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import { InnerStyledView, SplitView, NameText, SubText, OneLineText } from '../style.js';

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

  viewFriend = (id) => {
    this.props.navigation.navigate("Friends Profile", {
      friend_id: id
    });
  }

  getMyFriendsData = async () => {
    let jsonValue = await AsyncStorage.getItem('@spacebook_details'); console.log(jsonValue);
    let user_data = JSON.parse(jsonValue); console.log(user_data);
    return fetch(global.srv_url + "/user/" + user_data['id'] + "/friends", {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': user_data['token']
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        responseJson.forEach((element, index) => {
          this.getPhoto(element.user_id, index);
        });
        console.table(responseJson[0].profile_photo);
        this.setState({
          isLoading: false,
          myFriendsData: responseJson
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getPhoto = async (friends_user_id, index) => {
    let jsonValue = await AsyncStorage.getItem('@spacebook_details');
    let user_data = JSON.parse(jsonValue);
    fetch(global.srv_url + "/user/" + friends_user_id + "/photo", {
      method: 'GET',
      headers: {
        'X-Authorization': user_data['token']
      }
    })
      .then((res) => {
        return res.blob();
      })
      .then((resBlob) => {
        let data = URL.createObjectURL(resBlob);
        myFriendsData[index]["profile_photo"] = data;
      })
      .catch((err) => {
        console.log("error", err)
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
        <ScrollView>
          <FlatList
            data={this.state.myFriendsData}
            renderItem={({ item }) =>
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
                        borderWidth: 2
                      }}
                    />
                    <View style={{paddingLeft:'7px'}}>
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
            keyExtractor={item => item.user_id}
          />
        </ScrollView>


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