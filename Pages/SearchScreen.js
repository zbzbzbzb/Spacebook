import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, FlatList, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from 'react-native-select-dropdown'

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



  getSearchData = async () => {
    let jsonValue = await AsyncStorage.getItem('@spacebook_details'); console.log(jsonValue);
    let user_data = JSON.parse(jsonValue);
    var url = "http://localhost:3333/api/1.0.0/search?q=" + this.state.q 
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
      <View>
          <TextInput
            placeholder="Search for User"
            onChangeText={(q) => this.setState({ "q": q })}
            value={this.state.q}
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
            onPress={this.getSearchData}
          />
          
        <FlatList
          data={this.state.searchData}
          await renderItem=  {({ item }) =>
            <TouchableOpacity>
              <View>
                <View>
                  <Text>{item.user_givenname} {item.user_familyname}</Text>
                </View>
                <View>
                  <Text>Add Friend</Text>
                </View>
              </View>
            </TouchableOpacity>
          }
          keyExtractor={item => item.user_id}
        />
      </View>


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