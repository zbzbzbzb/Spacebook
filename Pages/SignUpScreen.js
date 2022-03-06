import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { SpacebookInput } from '../Components/SpacebookInput.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Save as Login} from './Login.js';
import { InnerStyledView, SplitView, NameText, SubText, OneLineText, SplitViewAround, SplitViewBetween } from '../style.js';


class SignUpScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: "",
      second_name: "",
      email: "",
      password: "",
    }
  }


  Save = async () => {
    let jsonValue = await AsyncStorage.getItem('@spacebook_details');
    let user_data = JSON.parse(jsonValue);

      return fetch(global.srv_url + "/user" , {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
            
            "first_name": this.state.first_name,
            "last_name": this.state.second_name,
            "email": this.state.email,
            "password": this.state.password
          })
      })
      .then((response) => {
        if(response.status == 400){
          console.log("User was not created - Email address errors");
        }else{
          console.log("User Created", response);
          this.props.navigation.navigate("Login", {
            autoLogin: true,
            signUpEmail: this.state.email,
            signUpPassword: this.state.password
          });
        }

      })
      .catch((err) => {
          console.log(err);
      })
  }

  //Might want some validation before setState()
  handleEmail = (value) => {
    this.setState({ "email": value })
  }

  render() {
    console.log("signup");
    return (
      <InnerStyledView>
        <SpacebookInput
          id="first_name"
          autoCorrect={false}
          label="First Name"
          changeText={(value) => this.setState({ "first_name": value })}
          inputvalue={this.state.first_name}
        />

        <SpacebookInput
          id="second_name"
          autoCorrect={false}
          label="Second Name"
          changeText={(value) => this.setState({ "second_name": value })}
          inputvalue={this.state.second_name}
        />
        <SpacebookInput
          id="email"
          autoCorrect={false}
          label="Email"
          changeText={(value) => this.setState({ "email": value })}
          inputvalue={this.state.email}
        />
        <SpacebookInput
          id="password"
          autoCorrect={false}
          label="Password"
          secureTextEntry = {true}
          changeText={(value) => this.setState({ "password": value })}
          inputvalue={this.state.password}
        />

        <Button
          title="Save"
          onPress={this.Save}
        />
      </InnerStyledView>
    );
  }
}

export default SignUpScreen;