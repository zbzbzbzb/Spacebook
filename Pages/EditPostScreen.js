import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, FlatList, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SpacebookInput } from '../Components/SpacebookInput.js';
import { InnerStyledView, SplitView, NameText, SubText, OneLineText, SplitViewAround, SplitViewBetween } from '../style.js';
import { ScrollView } from 'react-native-gesture-handler';


class EditPostScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            postData: [],
            text: "",
            post_id: this.props.route.params.post_id,
            isLoading: true
        };
    }

    componentDidMount() {
        this.getPost();
    }

    getPost = async () => {
        let jsonValue = await AsyncStorage.getItem('@spacebook_details');
        let user_data = JSON.parse(jsonValue);
        return fetch(global.srv_url + "/user/" + user_data['id'] + "/post/" + this.state.post_id, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': user_data['token']
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({
                    postData: responseJson,
                    text: responseJson.text,
                    isLoading: false
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }

    patchPost = async () => {
        let jsonValue = await AsyncStorage.getItem('@spacebook_details'); console.log(jsonValue);
        let user_data = JSON.parse(jsonValue);

        return fetch(global.srv_url + "/user/" + user_data['id'] + "/post/" + this.state.post_id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': user_data['token']
            },
            body: JSON.stringify({
                text: this.state.text
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.props.navigation.navigate("My Profile");
            })
            .catch((error) => {
                console.log(error);
            });
    }

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
                            autoCorrect={false}
                            label="Edit your Post"
                            changeText={(text) => this.setState({ "text": text })}
                            inputvalue={this.state.text}
                            multiline={true}
                            numberOfLines={17}
                        />
                        <Button
                            title="Edit Post"
                            onPress={() => this.patchPost()}
                        />
                    </InnerStyledView>

                </ScrollView>

            );
        }
    }
}
export default EditPostScreen;
