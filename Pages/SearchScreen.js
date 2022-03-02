import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, FlatList, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from 'react-native-select-dropdown';
import { SpacebookInput } from '../Components/SpacebookInput.js';
import { InnerStyledView, SplitView, NameText, SubText, OneLineText, SplitViewAround, SplitViewBetween } from '../style.js';
import { ScrollView } from 'react-native-gesture-handler';


const search_in_drop = ["Friends", "All"];

class SearchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchData: [],
      q: "",
      search_in: "",
      limit: 20,
      offset: 0
    };
  }

  addFriend = async (friendId) => {
    let jsonValue = await AsyncStorage.getItem('@spacebook_details'); console.log(jsonValue);
    let user_data = JSON.parse(jsonValue);

    return fetch(global.srv_url + "/user/" + friendId + "/friends", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'X-Authorization': user_data['token']
      }
    })
      .then((response) => {
        if(response.status == 403){
          alert("User already added as a friend");
        }else{
          console.log("Friend Request Sent");
        }


      })
      .catch((err) => {
        if(err.status == 403){
          alert("User already added as a friend");
        }else{
          console.log(err);
        }
      })

  }

  getSearchData = async () => {
    let jsonValue = await AsyncStorage.getItem('@spacebook_details'); console.log(jsonValue);
    let user_data = JSON.parse(jsonValue);
    var url = global.srv_url + "/search?q=" + this.state.q
      + "&search_in=" + this.state.search_in
      + "&limit=" + this.state.limit
      + "&offset=" + this.state.offset;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': user_data['token']
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
          searchData: responseJson
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    console.log('Search');
    return (
      <ScrollView>

        <SpacebookInput
          autoCorrect={false}
          label="Search for User"
          changeText={(q) => this.setState({ "q": q })}
          inputvalue={this.state.q}
        />
        <SelectDropdown
          data={search_in_drop}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index)
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            this.state.search_in = selectedItem.toLowerCase();
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => { return item }}
        />

        <Button
          title="Search"
          onPress={() => this.getSearchData()}
        />
        <Fragment>
          <FlatList
            data={this.state.searchData}
            extraData={this.state}
            await renderItem={({ item }) =>
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
            keyExtractor={item => item.user_id}
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