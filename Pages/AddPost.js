import React, {Component} from 'react';
import {Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SpacebookInput} from '../Components/SpacebookInput';
import {InnerStyledView} from '../style.js';

class AddPostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
    };
  }

  addPost = async () => {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details');
    const userData = JSON.parse(jsonValue);
    return fetch(global.srv_url + '/user/' + userData['id'] + '/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': userData['token'],
      },
      body: JSON.stringify({
        text: this.state.text,
      }),
    })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          this.setState({text: ''});
        })
        .catch((error) => {
          console.log(error);
        });
  };

  render() {
    console.log('AddPost');
    return (
      <InnerStyledView>
        <SpacebookInput
          autoCorrect={false}
          label="Write your Post"
          changeText={(text) => this.setState({'text': text})}
          inputvalue={this.state.text}
          multiline={true}
          numberOfLines={17}
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

