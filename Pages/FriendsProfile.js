import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendsProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      allPostsData: [],
      friend_id: this.props.route.params.friend_id,
    };
  }

  componentDidMount() {
    this.getAllPosts();
  }

  likePost = async (post_id) => {
    let jsonValue = await AsyncStorage.getItem('@spacebook_details'); console.log(jsonValue);
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
    let jsonValue = await AsyncStorage.getItem('@spacebook_details');console.log(jsonValue);
    let user_data = JSON.parse(jsonValue);console.log(user_data);
    return fetch(global.srv_url + "/user/" + this.state.friend_id + "/post",{
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
    } else {console.log(this.state.allPostsData);
      return (
        <View>
          <Fragment>
          <FlatList
            data={this.state.allPostsData}
            renderItem={({ item }) =>
              <TouchableOpacity>
                <View >
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
                        //onPress={() => this.handleFR(item.user_id, "DELETE")}
                        />
                  </View>
                </View>
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
export default FriendsProfile;


