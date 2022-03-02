import React, { Component, Fragment } from 'react';
import { Text, View, Button, ActivityIndicator, FlatList, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InnerStyledView, SplitView, NameText, SubText, OneLineText } from '../style.js';
import { ScrollView } from 'react-native-gesture-handler';

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

  format_date = (date) => {
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var dateString = new Date(date);
    return dateString.toLocaleDateString("en-US", options);
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
      console.log(this.state.postData);
      return (
        <View>
          <Fragment>
            <FlatList
              data={this.state.postData}
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
                    </View>
                  </InnerStyledView>
                </TouchableOpacity>
              }
              keyExtractor={item => item.post_id}
            />
          </Fragment>
        </View>


      );
    }
  }
}
export default ViewPost;


