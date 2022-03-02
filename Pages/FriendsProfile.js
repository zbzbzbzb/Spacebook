import React, { Component, Fragment } from 'react';
import { Text, View, Button, ActivityIndicator, FlatList, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InnerStyledView, SplitView, NameText, SubText, OneLineText } from '../style.js';
import { ScrollView } from 'react-native-gesture-handler';
import { Post } from '../Components/Post.js';

class FriendsProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      profileData: [],
      allPostsData: [],
      photo: null,
      friend_id: this.props.route.params.friend_id,
    };
  }

  componentDidMount() {
    this.getProfileData();
    this.getPhotoData();
    this.getAllPosts();
  }

  getAllPosts = async () => {
    let jsonValue = await AsyncStorage.getItem('@spacebook_details');
    let user_data = JSON.parse(jsonValue);
    return fetch(global.srv_url + "/user/" + this.state.friend_id + "/post", {
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
          allPostsData: responseJson
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getProfileData = async () => {
    let jsonValue = await AsyncStorage.getItem('@spacebook_details');
    let user_data = JSON.parse(jsonValue);
    return fetch(global.srv_url + "/user/" + this.state.friend_id, {
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
          profileData: responseJson
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getPhotoData = async () => {
    let jsonValue = await AsyncStorage.getItem('@spacebook_details');
    let user_data = JSON.parse(jsonValue);
    fetch(global.srv_url + "/user/" + this.state.friend_id + "/photo", {
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
        this.setState({
          photo: data,
        });
      })
      .catch((err) => {
        console.log("error", err)
      });
  }

  viewPost = (post_id, friend_id) => {
    this.props.navigation.navigate("View Post", {
      post_id: post_id,
      friend_id: friend_id,
    });
  }

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
      return (
        <ScrollView>
          <InnerStyledView>
            <SplitView>
              <Image
                source={{
                  uri: this.state.photo,
                }}
                style={{
                  width: 100,
                  height: 100,
                  borderWidth: 2
                }}
              />
              <View style={{ paddingLeft: '7px' }}>
                <NameText>{this.state.profileData.first_name} {this.state.profileData.last_name}</NameText>
                <OneLineText><SubText>My Email</SubText><Text> {this.state.profileData.email}</Text></OneLineText>
                <OneLineText><SubText>Friends</SubText><Text> {this.state.profileData.friend_count}</Text></OneLineText>
              </View>
            </SplitView>
          </InnerStyledView>
          <Fragment>
            <FlatList
              data={this.state.allPostsData}
              renderItem={({ item }) =>
                <TouchableOpacity>
                  <Post
                    post_id={item.post_id}
                    text={item.text}
                    timestamp={item.timestamp}
                    numLikes={item.numLikes}
                    friend_id={this.state.friend_id}
                    view={() => this.viewPost(item.post_id, this.state.friend_id)}
                  />
                </TouchableOpacity>
              }
              keyExtractor={item => item.post_id}
            />

          </Fragment>
        </ScrollView>


      );
    }
  }
}
export default FriendsProfile;


