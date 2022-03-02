import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InnerStyledView, SplitView, NameText, SubText, OneLineText } from '../style.js';

class MyProfileScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            profileData: [],
            photo: null
        };
    }

    async componentDidMount() {
        await this.getProfileData();
        await this.getPhotoData();
    }

    editProfile = () => {
        this.props.navigation.navigate("Edit Profile");
    }

    editProfilePhoto = () => {
        this.props.navigation.navigate("Edit Profile Photo");
    }

    logOut = async () => {
        let jsonValue = await AsyncStorage.getItem('@spacebook_details'); 
        let user_data = JSON.parse(jsonValue); 
        fetch(global.srv_url + "/logout", {
            method: 'POST',
            headers: {
                'X-Authorization': user_data['token']
            }
        })
        .then((response) => response.json())
        .then((responseJson) => {
            AsyncStorage.clear();
            jsonValue.clear;
            user_data.clear
            this.props.navigation.navigate("Login");
        })
        .catch((error) => {
            console.log(error);
        });
    }

    getPhotoData = async () => {
        let jsonValue = await AsyncStorage.getItem('@spacebook_details'); 
        let user_data = JSON.parse(jsonValue); 
        fetch(global.srv_url + "/user/" + user_data['id'] + "/photo", {
            method: 'GET',
            headers: {
                'X-Authorization': user_data['token']
            }
        })
            .then((res) => {
                return res.blob();
            })
            .then((resBlob) => {
                let data = URL.createObjectURL(resBlob);
                this.setState({
                    photo: data,
                    isLoading: false
                });
            })
            .catch((err) => {
                console.log("error", err)
            });
    }

    getProfileData = async () => {
        let jsonValue = await AsyncStorage.getItem('@spacebook_details'); console.log(jsonValue);
        let user_data = JSON.parse(jsonValue); console.log(user_data);
        return fetch(global.srv_url + "/user/" + user_data['id'], {
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
                    profileData: responseJson
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        console.log('My Profile');
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
                <View style={{ height: '90vh', width: '100vw' }}>
                    <Image
                        source={{
                            uri: this.state.photo,
                        }}
                        style={{
                            width: '100%',
                            height: '400px',
                            borderWidth: 4
                        }}
                    />
                    <InnerStyledView>
                    <NameText>{this.state.profileData.first_name} {this.state.profileData.last_name}</NameText>
                <OneLineText><SubText>My Email</SubText><Text> {this.state.profileData.email}</Text></OneLineText>
                <OneLineText><SubText>Friends</SubText><Text> {this.state.profileData.friend_count}</Text></OneLineText>
                    </InnerStyledView>
                    <View style={{ position: 'absolute', bottom: 0, width: '100vw' }}>

                        <Button onPress={this.editProfile} title="Edit Profile" />
                        <Button onPress={this.editProfilePhoto} title="Change Profile Photo" />
                        <Button onPress={this.logOut} title="Log Out" />
                    </View>
                </View>
            );
        }
    }
}
export default MyProfileScreen;

/*
GET
/user/{user_id}
Get user information
 
PATCH
/user/{user_id}
Update user information
 
GET
/user/{user_id}/photo
Get a users profile photo
 
POST
/user/{user_id}/photo
Upload a profile photo
*/