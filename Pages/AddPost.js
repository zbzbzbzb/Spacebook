import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SpacebookInput } from '../Components/SpacebookInput';
import {InnerStyledView} from '../style.js';

class AddPostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: ""
    }
  }

  addPost = async () => {
    let jsonValue = await AsyncStorage.getItem('@spacebook_details');console.log(jsonValue);
    let user_data = JSON.parse(jsonValue);console.log(user_data);
    return fetch(global.srv_url + "/user/" + user_data['id'] + "/post",{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': user_data['token']
      },
      body: JSON.stringify({
        text: this.state.text,
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    console.log('AddPost');
      return (
        <InnerStyledView>
        <SpacebookInput
          autoCorrect={false}
          label="Write your Post"
          changeText={(text) => this.setState({ "text": text })}
          inputvalue={this.state.text}
          multiline={true}
          numberOfLines={6}
        />
        
        
        <Button
          title="Submit"
          onPress={() => this.addPost()}
        />

      </InnerStyledView>
      );
    
  }
}
export default AddPostScreen;

