import React, {Component} from 'react';
import {Button, View} from 'react-native';
import {SpacebookInput} from '../Components/SpacebookInput.js';
import {InnerStyledView} from '../style.js';
import AwesomeAlert from 'react-native-awesome-alerts';

class SignUpScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: '',
      second_name: '',
      email: '',
      password: '',
      showAlert: false,
      alertError: '',
    };
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

  Save = async () => {
    return fetch(global.srv_url + '/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

        'first_name': this.state.first_name,
        'last_name': this.state.second_name,
        'email': this.state.email,
        'password': this.state.password,
      }),
    })
        .then((response) => {
          if (response.status == 201) {
            this.props.navigation.navigate('Login', {
              autoLogin: true,
              signUpEmail: this.state.email,
              signUpPassword: this.state.password,
            });
          } else {
            let text;
            switch (response.status) {
              case 400:
                text = 'User was not created - Please check your inputs';
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
        .catch((err) => {
          console.log(err);
        });
  };

  // Might want some validation before setState()
  handleEmail = (value) => {
    this.setState({'email': value});
  };

  render() {
    console.log('signup');
    const {showAlert} = this.state;
    return (
      <View>
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
            onPress={this.Save}
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
      </View>
    );
  }
}

export default SignUpScreen;
