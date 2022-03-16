import React, {Component} from 'react';
import {Text, View, Button, ActivityIndicator, FlatList, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {InnerStyledView, SplitView, NameText,
  SubText, OneLineText, SplitViewBetween} from '../style.js';
import {ScrollView} from 'react-native-gesture-handler';
import {Post} from '../Components/Post.js';
import AwesomeAlert from 'react-native-awesome-alerts';

class MyProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      profileData: [],
      allPostsData: [],
      photo: null,
      showAlert: false,
      alertError: '',
    };
  }

  async componentDidMount() {
    await this.getProfileData();
    await this.getPhotoData();
    await this.getAllPosts();
  }

  showAlert = (text) => {
    this.setState({
      alertError: text,
      showAlert: true,
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  editProfile = () => {
    this.props.navigation.navigate('Edit Profile');
  };

  editProfilePhoto = () => {
    this.props.navigation.navigate('Edit Profile Photo');
  };

  logOut = async () => {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details');
    const userData = JSON.parse(jsonValue);
    fetch(global.srv_url + '/logout', {
      method: 'POST',
      headers: {
        'X-Authorization': userData['token'],
      },
    })
        .then((response) => response)
        .then((data) => {
          let text;
          switch (data.status) {
            case 200:
              AsyncStorage.clear();
              jsonValue.clear;
              userData.clear;
              this.props.navigation.navigate('Login');
              text = 'You have logged out';
              break;
            case 401:
              text = 'You are not logged in';
              break;
            case 500:
              text = 'A Server Error has occurred';
              break;
          }
          this.showAlert(text);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  getPhotoData = async () => {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details');
    const userData = JSON.parse(jsonValue);
    fetch(global.srv_url + '/user/' + userData['id'] + '/photo', {
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
          this.setState({
            photo: data,
          });
        })
        .catch((err) => {
          console.log('error', err);
        });
  };

  getProfileData = async () => {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details');
    const userData = JSON.parse(jsonValue);
    return fetch(global.srv_url + '/user/' + userData['id'], {
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
            profileData: responseJson,
          });
        })
        .catch((error) => {
          console.log(error);
        });
  };

  getAllPosts = async () => {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details');
    const userData = JSON.parse(jsonValue);
    return fetch(global.srv_url + '/user/' + userData['id'] + '/post', {
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
            allPostsData: responseJson,
          });
        })
        .catch((error) => {
          console.log(error);
        });
  };

  viewPost = (postId, friendId) => {// Friend ID is actually user id
    this.props.navigation.navigate('View Post', {
      post_id: postId,
      friend_id: friendId,
    });
  };

  updatePost = (postId) => {
    this.props.navigation.navigate('Edit Post', {
      post_id: postId,
    });
  };

  render() {
    const {showAlert} = this.state;
    console.log('My Profile');
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
            ListHeaderComponent={
              <InnerStyledView>
              <SplitView>
                <Image
                  source={{
                    uri: this.state.photo,
                  }}
                  style={{
                    width: 80,
                    height: 80,
                    borderWidth: 2,
                  }}
                />
                <View>
                  <NameText>
                    {this.state.profileData.first_name} {this.state.profileData.last_name}
                  </NameText>
                  <OneLineText>
                    <SubText>My Email</SubText>
                    <Text> {this.state.profileData.email}</Text>
                  </OneLineText>
                  <OneLineText>
                    <SubText>Friends</SubText>
                    <Text> {this.state.profileData.friend_count}</Text>
                  </OneLineText>
                </View>
              </SplitView>
              <SplitViewBetween>
                <Button onPress={this.editProfile} title="Edit Profile" />
                <Button onPress={this.editProfilePhoto} title="Edit Profile Photo" />
                <Button onPress={this.logOut} title="Log Out" />
              </SplitViewBetween>
            </InnerStyledView>
            }
            data={this.state.allPostsData}
            renderItem={({item}) =>

              <Post
                post_id={item.post_id}
                text={item.text}
                timestamp={item.timestamp}
                numLikes={item.numLikes}
                friend_id={this.state.profileData.user_id}
                view={() => this.viewPost(item.post_id, this.state.profileData.user_id)}
                updel={true}
                update={() => this.updatePost(item.post_id, this.state.profileData.user_id)}
                showAlert={(text) => this.showAlert(text)}
                reload={() => this.getAllPosts()}
              />

            }
            keyExtractor={(item) => item.post_id}
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
export default MyProfileScreen;

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
