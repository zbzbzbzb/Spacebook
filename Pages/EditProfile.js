import React, {Component} from 'react';
import {View, Button, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SpacebookInput} from '../Components/SpacebookInput.js';
import {InnerStyledView} from '../style.js';
import {ScrollView} from 'react-native-gesture-handler';

class EditProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profileData: [],
      first_name: '',
      second_name: '',
      email: '',
      password: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getProfileData();
  }

  getProfileData = async () => {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details');
    const userData = JSON.parse(jsonValue);
    return fetch(global.srv_url + '/user/' + userData['id'], {
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
            first_name: responseJson.first_name,
            second_name: responseJson.last_name,
            email: responseJson.email,
            password: responseJson.password,
            isLoading: false,
          });
        })
        .catch((error) => {
          console.log(error);
        });
  };

  patchProfile = async () => {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details');
    const userData = JSON.parse(jsonValue);

    return fetch(global.srv_url + '/user/' + userData['id'], {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': userData['token'],
      },
      body: JSON.stringify({
        first_name: this.state.first_name,
        last_name: this.state.second_name,
        email: this.state.email,
        password: this.state.password,
      }),
    })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          this.props.navigation.navigate('My Profile');
        })
        .catch((error) => {
          console.log(error);
        });
  };

  render() {
    console.log('Edit Post');
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
              id="first_name"
              autoCorrect={false}
              label="First Name"
              changeText={(value) => this.setState({'first_name': value})}
              inputvalue={this.state.first_name}
            />

            <SpacebookInput
              id="second_name"
              autoCorrect={false}
              label="Second Name"
              changeText={(value) => this.setState({'second_name': value})}
              inputvalue={this.state.second_name}
            />
            <SpacebookInput
              id="email"
              autoCorrect={false}
              label="Email"
              changeText={(value) => this.setState({'email': value})}
              inputvalue={this.state.email}
            />
            <SpacebookInput
              id="password"
              autoCorrect={false}
              label="Password"
              secureTextEntry={true}
              changeText={(value) => this.setState({'password': value})}
              inputvalue={this.state.password}
            />

            <Button
              title="Save"
              onPress={this.patchProfile}
            />
          </InnerStyledView>
        </ScrollView>

      );
    }
  }
}
export default EditProfileScreen;
