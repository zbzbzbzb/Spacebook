import React, {Component} from 'react';
import {View, Button, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SpacebookInput} from '../Components/SpacebookInput';
import {InnerStyledView} from '../style.js';
import AwesomeAlert from 'react-native-awesome-alerts';
import {Picker} from '@react-native-picker/picker';

class AddPostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      showAlert: false,
      isLoading: true,
      alertError: '',
      myFriends: {},
      postToId: 0,
      myId: 0,
    };
  }

  componentDidMount() {
    this.getMyFriends();
  }

  showAlert = () => {
    this.setState({
      showAlert: true,
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  getMyFriends = async () => {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details');
    const userData = JSON.parse(jsonValue);
    const url = global.srv_url + '/search?search_in=friends';
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': userData['token'],
      },
    })
        .then((response) => {
          let text;
          if (response.status == 200) {
            response.json().then((json) =>{
              console.log(json);
              this.setState({
                isLoading: false,
                myFriends: json,
                myId: userData['id'],
              });
            });
          } else {
            switch (response.status) {
              case 400:
                text = 'The text you entered was invalid';
                break;
              case 401:
                text = 'You are not logged in';
                break;
              case 500:
                text = 'A Server Error has occurred';
                break;
            }
            this.setState({
              alertError: text,
            });
            this.showAlert();
          }
        })
        .catch((error) => {
          console.log(error);
        });
  };

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
        .then((response) => {
          let text;
          switch (response.status) {
            case 201:
              this.setState({text: '', postToId: 0});
              text = 'Your Post as been created';
              break;
            case 401:
              text = 'You are not logged in';
              break;
            case 404:
              text = 'User not found';
              break;
            case 500:
              text = 'A Server Error has occurred';
              break;
          }
          this.setState({
            alertError: text,
          });
          this.showAlert();
        })
        .catch((error) => {
          console.log(error);
        });
  };

  render() {
    console.log('AddPost');
    const {showAlert} = this.state;
    let postMyTimeline;
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
      if (this.state.myId != 0) {
        postMyTimeline = <Picker.Item label="Post to my Timeline" value={this.state.myId} />;
      }

      const friendsTimeline = this.state.myFriends.map((element) =>
        <Picker.Item label={element.user_givenname} value={element.user_id} key={element.user_id}/>,
      );
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

          <Picker
            selectedValue= {this.state.postToId}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({'postToId': itemValue})
            }>
            {postMyTimeline}
            {friendsTimeline}
          </Picker>

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
        </InnerStyledView>
      );
    }
  }
}
export default AddPostScreen;

