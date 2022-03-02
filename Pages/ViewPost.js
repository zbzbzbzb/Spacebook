import React, { Component, Fragment } from 'react';
import { Text, View, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InnerStyledView, SplitView, NameText, SubText, OneLineText, SplitViewAround, SplitViewBetween } from '../style.js';
import { ScrollView } from 'react-native-gesture-handler';
import { Post } from '../Components/Post.js';

class ViewPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      postData: [],
      post_id: this.props.route.params.post_id,
      friend_id: this.props.route.params.friend_id,
    };
  }

  componentDidMount() {
    this.getPost();
  }

  getPost = async () => {
    let jsonValue = await AsyncStorage.getItem('@spacebook_details');
    let user_data = JSON.parse(jsonValue);
    return fetch(global.srv_url + "/user/" + this.state.friend_id + "/post/" + this.state.post_id, {
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
          postData: responseJson,
          isLoading: false
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    console.log('View Post');
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
          <TouchableOpacity>


            <Post
              post_id={this.state.postData.post_id}
              text={this.state.postData.text}
              timestamp={this.state.postData.timestamp}
              numLikes={this.state.postData.numLikes}
              friend_id={this.state.friend_id}
            />

            <InnerStyledView>
              <SubText>Post by {this.state.postData.author.first_name} {this.state.postData.author.last_name} </SubText>
            </InnerStyledView>
          </TouchableOpacity>
        </ScrollView>


      );
    }
  }
}
export default ViewPost;


