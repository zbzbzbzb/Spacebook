import React, {Component, Fragment} from 'react';
import {Text, View, Button, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import {SpacebookInput} from '../Components/SpacebookInput.js';
import {InnerStyledView, SplitViewBetween} from '../style.js';
import {ScrollView} from 'react-native-gesture-handler';
import AwesomeAlert from 'react-native-awesome-alerts';

const searchInDrop = ['friends', 'all'];

class SearchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchData: [],
      q: '',
      search_in: 'all',
      limit: 20,
      offset: 0,
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

  addFriend = async (friendId) => {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details');
    const userData = JSON.parse(jsonValue);

    return fetch(global.srv_url + '/user/' + friendId + '/friends', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': userData['token'],
      },
    })
        .then((response) => {
          let text;
          switch (response.status) {
            case 200:
              text = 'Friend Request Sent';
              break;
            case 401:
              text = 'You are not logged in';
              break;
            case 403:
              text = 'User already added as a friend';
              break;
            case 403:
              text = 'Friend not found';
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
          if (err.status == 403) {
            alert('User already added as a friend');
          } else {
            console.log(err);
          }
        });
  };

  getSearchData = async () => {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details');
    const userData = JSON.parse(jsonValue);
    const url = global.srv_url + '/search?q=' + this.state.q +
      '&search_in=' + this.state.search_in +
      '&limit=' + this.state.limit +
      '&offset=' + this.state.offset;
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
              this.setState({
                isLoading: false,
                searchData: json,
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

  render() {
    console.log('Search');
    const {showAlert} = this.state;
    const selectOptions = searchInDrop.map((element) =>
      <Picker.Item label={element} value={element} key={element}/>,
    );
    return (

          <FlatList
            ListHeaderComponent={
              <InnerStyledView>
              <SpacebookInput
                autoCorrect={false}
                label="Search for User"
                changeText={(q) => this.setState({'q': q})}
                inputvalue={this.state.q}
              />
              <SplitViewBetween>
                <Text>Press to choose</Text>
    
                <Picker
                  selectedValue={this.state.search_in}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({'search_in': itemValue.toLowerCase()})
                  }>
                  {selectOptions}
                </Picker>
              </SplitViewBetween>
              <Button
                title="Search"
                onPress={() => this.getSearchData()}
              />
            </InnerStyledView>
            }
            data={this.state.searchData}
            extraData={this.state}
            await renderItem={({item}) =>
              <InnerStyledView>
                <View>
                  <Text>{item.user_givenname} {item.user_familyname}</Text>
                </View>
                <Button
                  title="Add Friend"
                  onPress={() => this.addFriend(item.user_id)}
                />
              </InnerStyledView>
            }
            keyExtractor={(item) => item.user_id}
            ListFooterComponent={
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
            }
          />


    );
  }
}
export default SearchScreen;

/*  SEARCH

POST
/user/{user_id}/friends
Add a new friend

GET
/search
Find friends
*/
