import React, {Component, Fragment} from 'react';
import {Text, View, ActivityIndicator, FlatList, TouchableOpacity, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {InnerStyledView, SplitView, NameText, SubText, OneLineText} from '../style.js';
import {ScrollView} from 'react-native-gesture-handler';
import {Post} from '../Components/Post.js';
import AwesomeAlert from 'react-native-awesome-alerts';

class FriendsProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      profileData: [],
      allPostsData: [],
      photo: null,
      friend_id: this.props.route.params.friend_id,
      showAlert: false,
      alertError: '',
    };
  }

  componentDidMount() {
    this.getProfileData();
    this.getPhotoData();
    this.getAllPosts();
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

  getAllPosts = async () => {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details');
    const userData = JSON.parse(jsonValue);
    return fetch(global.srv_url + '/user/' + this.state.friend_id + '/post', {
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

  getProfileData = async () => {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details');
    const userData = JSON.parse(jsonValue);
    return fetch(global.srv_url + '/user/' + this.state.friend_id, {
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

  getPhotoData = async () => {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details');
    const userData = JSON.parse(jsonValue);
    fetch(global.srv_url + '/user/' + this.state.friend_id + '/photo', {
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

  viewPost = (postId, friendId) => {
    this.props.navigation.navigate('View Post', {
      post_id: postId,
      friend_id: friendId,
    });
  };

  render() {
    console.log('All Posts');
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
      console.log(this.state.allPostsData);
      const {showAlert} = this.state;
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
                      width: 100,
                      height: 100,
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
              </InnerStyledView>
              }
              data={this.state.allPostsData}
              renderItem={({item}) =>
                <TouchableOpacity>
                  <Post
                    post_id={item.post_id}
                    text={item.text}
                    timestamp={item.timestamp}
                    numLikes={item.numLikes}
                    friend_id={this.state.friend_id}
                    view={() => this.viewPost(item.post_id, this.state.friend_id)}
                    showAlert={(text) => this.showAlert(text)}
                    reload={() => this.getAllPosts()}
                  />
                </TouchableOpacity>
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
export default FriendsProfile;


