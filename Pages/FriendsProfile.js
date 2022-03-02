import React, { Component, Fragment } from 'react';
import { Text, View, Button, ActivityIndicator, FlatList, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InnerStyledView, SplitView, NameText, SubText, OneLineText } from '../style.js';
import { ScrollView } from 'react-native-gesture-handler';

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

  viewPost = (post_id) =>{
    this.props.navigation.navigate("View Post", {
      post_id: post_id,
      friend_id: this.state.friend_id,
    });
  }

  likePost = async (post_id) => {
    let jsonValue = await AsyncStorage.getItem('@spacebook_details');
    let user_data = JSON.parse(jsonValue);

    return fetch(global.srv_url + "/user/" + this.state.friend_id + "/post/" + post_id + "/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'X-Authorization': user_data['token']
      }
    })
      .then((response) => {
        console.log("Post Liked");
        //Do something
      })
      .catch((err) => {
        console.log(err);
      })

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

  format_date = (date) => {
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var dateString = new Date(date);
    return dateString.toLocaleDateString("en-US", options);
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
        <View>
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
              <View style={{paddingLeft:'7px'}}>
                <NameText>{this.state.profileData.first_name} {this.state.profileData.last_name}</NameText>
                <OneLineText><SubText>My Email</SubText><Text> {this.state.profileData.email}</Text></OneLineText>
                <OneLineText><SubText>Friends</SubText><Text> {this.state.profileData.friend_count}</Text></OneLineText>
              </View>
            </SplitView>
          </InnerStyledView>
          <Fragment>
            <ScrollView>
            <FlatList
              data={this.state.allPostsData}
              renderItem={({ item }) =>
                <TouchableOpacity>
                  <InnerStyledView>
                    <View >
                      <Text>{item.text}</Text>
                      <Text>Date : {this.format_date(item.timestamp)}</Text>
                    </View>
                    <View>
                    <Button
                        title="Like"
                        onPress={() => this.likePost(item.post_id)}
                      />
                      <Button
                        title="View"
                        onPress={() => this.viewPost(item.post_id)}
                      />
                    </View>
                  </InnerStyledView>
                </TouchableOpacity>
              }
              keyExtractor={item => item.post_id}
            />
            </ScrollView>
          </Fragment>
        </View>


      );
    }
  }
}
export default FriendsProfile;


