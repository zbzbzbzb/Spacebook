import React, {Component} from 'react';
import {View, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SpacebookInput} from '../Components/SpacebookInput.js';
import {InnerStyledView, AddMargin} from '../style.js';
import AwesomeAlert from 'react-native-awesome-alerts';

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('@spacebook_details', jsonValue);
  } catch (e) {
    console.error(error);
  }
};

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    if (this.props.route.params !== undefined) {
      this.state = {
        email: this.props.route.params.signUpEmail,
        password: this.props.route.params.signUpPassword,
      };
      this.Save;
    }

    this.state = {
      email: 'zfbobat@gmail.co.uk',
      password: 'zahir123',
      showAlert: false,
      alertError: '',
    };
  }

  signUp = () => {
    this.props.navigation.navigate('SignUp');
  };

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
    fetch(global.srv_url + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/xml',
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    })
        .then((response) => response)
        .then((data) => {
          if (data.status == 200) {
            data.json().then((json) =>{
              storeData(json);
              this.props.navigation.navigate('Homescreen');
            });
          } else {
            let text;
            switch (json.status) {
              case 400:
                text = 'Email/Password Incorrect';
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

  render() {
    console.log('login');
    const {showAlert} = this.state;
    return (
      <View style={{height: '100%', flex: 1, justifyContent: 'center'}}>
        <InnerStyledView>
          <AddMargin>
            <SpacebookInput
              id="email"
              autoCorrect={false}
              label="Email"
              changeText={(value) => this.setState({'email': value})}
              inputvalue={this.state.email}
            />
          </AddMargin>
          <AddMargin>
            <SpacebookInput
              id="password"
              autoCorrect={false}
              label="Password"
              secureTextEntry={true}
              changeText={(value) => this.setState({'password': value})}
              inputvalue={this.state.password}
            />
          </AddMargin>
          <AddMargin>
            <Button
              title="Log In"
              onPress={this.Save}
            />
          </AddMargin>
          <AddMargin>
            <Button
              title="Sign Up"
              onPress={this.signUp}
            />
          </AddMargin>
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

export default LoginScreen;
