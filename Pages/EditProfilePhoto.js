import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Camera} from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';

class EditProfilePhotoScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasPermission: null,
      type: Camera.Constants.Type.back,
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

  async componentDidMount() {
    const {status} = await Camera.requestCameraPermissionsAsync();
    this.setState({hasPermission: status === 'granted'});
  }

  backToMyProfile = () => {
    this.props.navigation.navigate('My Profile');
  };

  sendToServer = async (data) => {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details');
    const userData = JSON.parse(jsonValue);

    const res = await fetch(data.base64);
    const blob = await res.blob();

    return fetch(global.srv_url + '/user/' + userData['id'] + '/photo', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/png',
        'X-Authorization': userData['token'],
      },
      body: blob,
    })
        .then((response) => {
          let text;
          switch (response.status) {
            case 200:
              console.log('Picture added', response);
              this.backToMyProfile();
              break;
            case 400:
              text = 'There was something wrong with the Image';
              break;
            case 401:
              text = 'You are not logged in';
              break;
            case 404:
              text = 'Not Found';
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
        .catch((err) => {
          console.log(err);
        });
  };

  takePicture = async () => {
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        onPictureSaved: (data) => this.sendToServer(data),
      };
      await this.camera.takePictureAsync(options);
    }
  };

  render() {
    const {showAlert} = this.state;
    if (this.state.hasPermission) {
      return (
        <View style={styles.container}>
          <Camera
            style={styles.camera}
            type={this.state.type}
            ref={(ref) => this.camera = ref}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonCenter}
                onPress={() => {
                  this.takePicture();
                }}>
                <Text style={styles.text}> Take Photo </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonLeft}
                onPress={() => {
                  this.backToMyProfile();
                }}>
                <Text style={styles.text}> Back </Text>
              </TouchableOpacity>
            </View>
          </Camera>
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
    } else {
      return (
        <Text>No access to camera</Text>
      );
    }
  }
}

export default EditProfilePhotoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  buttonCenter: {
    flex: 0.1,
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonLeft: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
