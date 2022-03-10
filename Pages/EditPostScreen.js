import React, {Component} from 'react';
import {View, Button, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SpacebookInput} from '../Components/SpacebookInput.js';
import {InnerStyledView} from '../style.js';
import {ScrollView} from 'react-native-gesture-handler';
import AwesomeAlert from 'react-native-awesome-alerts';

class EditPostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postData: [],
      text: '',
      post_id: this.props.route.params.post_id,
      isLoading: true,
      showAlert: false,
      alertError: '',
    };
  }

  componentDidMount() {
    this.getPost();
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

  getPost = async () => {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details');
    const userData = JSON.parse(jsonValue);
    return fetch(global.srv_url + '/user/' + userData['id'] +
        '/post/' + this.state.post_id, {
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
            postData: responseJson,
            text: responseJson.text,
            isLoading: false,
          });
        })
        .catch((error) => {
          console.log(error);
        });
  };

  patchPost = async () => {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details');
    const userData = JSON.parse(jsonValue);

    return fetch(global.srv_url + '/user/' + userData['id'] +
        '/post/' + this.state.post_id, {
      method: 'PATCH',
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
          if (response.status == 200) {
            this.props.navigation.navigate('My Profile');
          } else {
            switch (response.status) {
              case 400:
                text = 'The text you entered was invalid';
                break;
              case 401:
                text = 'You are not logged in';
                break;
              case 403:
                text = 'You can only update your own posts';
                break;
              case 404:
                text = 'Post Not found';
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

  render() {
    console.log('Edit Post');
    const {showAlert} = this.state;
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
          <InnerStyledView>
            <SpacebookInput
              autoCorrect={false}
              label="Edit your Post"
              changeText={(text) => this.setState({'text': text})}
              inputvalue={this.state.text}
              multiline={true}
              numberOfLines={17}
            />
            <Button
              title="Edit Post"
              onPress={() => this.patchPost()}
            />
          </InnerStyledView>
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
        </ScrollView>

      );
    }
  }
}
export default EditPostScreen;
