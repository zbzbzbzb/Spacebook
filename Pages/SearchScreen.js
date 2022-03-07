import React, {Component, Fragment} from 'react';
import {Text, View, Button, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from 'react-native-select-dropdown';
import {SpacebookInput} from '../Components/SpacebookInput.js';
import {InnerStyledView, SplitViewBetween} from '../style.js';
import {ScrollView} from 'react-native-gesture-handler';


const searchInDrop = ['Friends', 'All'];

class SearchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchData: [],
      q: '',
      search_in: '',
      limit: 20,
      offset: 0,
    };
  }

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
          if (response.status == 403) {
            alert('User already added as a friend');
          } else {
            console.log('Friend Request Sent');
          }
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
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          this.setState({
            isLoading: false,
            searchData: responseJson,
          });
        })
        .catch((error) => {
          console.log(error);
        });
  };

  render() {
    console.log('Search');
    return (
      <ScrollView>
        <InnerStyledView>
          <SpacebookInput
            autoCorrect={false}
            label="Search for User"
            changeText={(q) => this.setState({'q': q})}
            inputvalue={this.state.q}
          />
          <SplitViewBetween>
            <Text>Press to choose</Text>
            <SelectDropdown
              data={searchInDrop}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                this.setState({'search_in': selectedItem.toLowerCase()});
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
            />
          </SplitViewBetween>
          <Button
            title="Search"
            onPress={() => this.getSearchData()}
          />
        </InnerStyledView>
        <Fragment>
          <FlatList
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
          />
        </Fragment>
      </ScrollView>

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
