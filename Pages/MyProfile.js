import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, FlatList, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InnerStyledView, SplitView, NameText, SubText, OneLineText, SplitViewBetween } from '../style.js';
import { ScrollView } from 'react-native-gesture-handler';
import { Post } from '../Components/Post.js';

class MyProfileScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            profileData: [],
            allPostsData: [],
            photo: null
        };
    }

    async componentDidMount() {
        await this.getProfileData();
        await this.getPhotoData();
        await this.getAllPosts();

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

    getAllPosts = async () => {
        let jsonValue = await AsyncStorage.getItem('@spacebook_details');
        let user_data = JSON.parse(jsonValue);
        return fetch(global.srv_url + "/user/" + user_data['id'] + "/post", {
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
                    isLoading: false,
                    allPostsData: responseJson
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }

    viewPost = (post_id, friend_id) => {//Friend ID is actually user id
        this.props.navigation.navigate("View Post", {
            post_id: post_id,
            friend_id: friend_id,
        });
    }

    updatePost = (post_id) => {
        this.props.navigation.navigate("Edit Post", {
            post_id: post_id
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
                <ScrollView>
                    <InnerStyledView>
                        <SplitView>
                            <Image
                                source={{
                                    uri: this.state.photo,
                                }}
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderWidth: 2
                                }}
                            />
                            <View style={{ paddingLeft: '7px' }}>
                                <NameText>{this.state.profileData.first_name} {this.state.profileData.last_name}</NameText>
                                <OneLineText><SubText>My Email</SubText><Text> {this.state.profileData.email}</Text></OneLineText>
                                <OneLineText><SubText>Friends</SubText><Text> {this.state.profileData.friend_count}</Text></OneLineText>
                            </View>
                        </SplitView>
                        <SplitViewBetween>
                            <Button onPress={this.editProfile} title="Edit Profile" />
                            <Button onPress={this.editProfilePhoto} title="Edit Profile Photo" />
                            <Button onPress={this.logOut} title="Log Out" />
                        </SplitViewBetween>
                    </InnerStyledView>

                    <FlatList
                        data={this.state.allPostsData}
                        renderItem={({ item }) =>

                            <Post
                                post_id={item.post_id}
                                text={item.text}
                                timestamp={item.timestamp}
                                numLikes={item.numLikes}
                                friend_id={this.state.profileData.user_id}
                                view={() => this.viewPost(item.post_id, this.state.profileData.user_id)}
                                updel={true}
                                update={() => this.updatePost(item.post_id, this.state.profileData.user_id)}
                            />

                        }
                        keyExtractor={item => item.post_id}
                    />


                </ScrollView>
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