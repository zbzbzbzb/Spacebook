import React, {Component} from 'react';
import {View, ActivityIndicator, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {InnerStyledView, SubText} from '../style.js';
import {ScrollView} from 'react-native-gesture-handler';
import {Post} from '../Components/Post.js';
import AwesomeAlert from 'react-native-awesome-alerts';

class ViewPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      postData: [],
      post_id: this.props.route.params.post_id,
      friend_id: this.props.route.params.friend_id,
      showAlert: false,
      alertError: '',
    };
  }

  componentDidMount() {
    this.getPost();
  }

  showAlert = (text) => {
    this.setState({
      alertError: text,
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
    return fetch(global.srv_url + '/user/' + this.state.friend_id + '/post/' + this.state.post_id, {
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
            isLoading: false,
          });
        })
        .catch((error) => {
          console.log(error);
        });
  };

  render() {
    const {showAlert} = this.state;
    console.log('View Post');
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
          <TouchableOpacity>


            <Post
              post_id={this.state.postData.post_id}
              text={this.state.postData.text}
              timestamp={this.state.postData.timestamp}
              numLikes={this.state.postData.numLikes}
              friend_id={this.state.friend_id}
              showAlert={(text) => this.showAlert(text)}
              reload={() => this.getPost()}
            />

            <InnerStyledView>
              <SubText>
                Post by {this.state.postData.author.first_name} {this.state.postData.author.last_name}
              </SubText>
            </InnerStyledView>
          </TouchableOpacity>

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
export default ViewPost;


