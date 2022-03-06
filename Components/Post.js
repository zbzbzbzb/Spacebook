import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { InnerStyledView, SplitView, NameText, SubText, OneLineText, SplitViewAround, SplitViewBetween, AddMargin } from '../style.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const likePost = async (post_id, friend_id) => {
    let jsonValue = await AsyncStorage.getItem('@spacebook_details');
    let user_data = JSON.parse(jsonValue);

    return fetch(global.srv_url + "/user/" + friend_id + "/post/" + post_id + "/like", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'X-Authorization': user_data['token']
        }
    })
        .then((response) => {
            console.log("Post Liked");
            //Do something
        })
        .catch((err) => {
            console.log(err);
        })

}

const unlikePost = async (post_id, friend_id) => {
    let jsonValue = await AsyncStorage.getItem('@spacebook_details');
    let user_data = JSON.parse(jsonValue);

    return fetch(global.srv_url + "/user/" + friend_id + "/post/" + post_id + "/like", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            'X-Authorization': user_data['token']
        }
    })
        .then((response) => {
            console.log("Post Unliked");
            //Do something
        })
        .catch((err) => {
            console.log(err);
        })

}

const deletePost = async (post_id, friend_id) => {
    let jsonValue = await AsyncStorage.getItem('@spacebook_details');
    let user_data = JSON.parse(jsonValue);

    return fetch(global.srv_url + "/user/" + friend_id + "/post/" + post_id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            'X-Authorization': user_data['token']
        }
    })
        .then((response) => {
            console.log("Post Deleted");
            //Do something
        })
        .catch((err) => {
            console.log(err);
        })

}

const format_date = (date) => {
    console.log(date);
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var dateString = new Date(date);
    return dateString.toLocaleDateString("en-US", options);
}

const Post = ({ post_id, text, timestamp, numLikes, friend_id, view, updel, update }) => {
    const { likeButtons, updelButtons } = styles;
    var viewButton;
    if (view == undefined) {
        view = false;
    } else {
        viewButton = <Button
            title="View"
            onPress={view}
        />;
    }

    var updateButton;
    var deleteButton;
    if (updel == undefined) {
        updel = false;
    } else {
        updateButton = <View style={updelButtons}><Button
            title="Update"
            onPress={update}
            
        /></View>;
        deleteButton = <View style={updelButtons}><Button
            title="Delete"
            onPress={() => deletePost(post_id, friend_id)}
            style={updelButtons}
        /></View>;
    }

    return (
        <InnerStyledView>
            <View >
                <Text>{text} {'\n\n'}</Text>
            </View>

            <SplitViewBetween>
                <View>
                    <Text>Date : {format_date(timestamp)}</Text>
                    <Text>Num of Likes {numLikes}</Text>
                </View>
                <SplitViewAround>
                    <AddMargin>
                        <Button
                            title="Like"
                            onPress={() => likePost(post_id, friend_id)}
                        />
                    </AddMargin>
                    <AddMargin>
                        <Button
                            title="Unlike"
                            onPress={() => unlikePost(post_id, friend_id)}
                        />
                    </AddMargin>
                </SplitViewAround>
            </SplitViewBetween>
            <AddMargin>
                {viewButton}
            </AddMargin>
            <SplitViewAround>
                {updateButton}
                {deleteButton}
            </SplitViewAround>
        </InnerStyledView>
    );
}

const styles = {
    updelButtons: {
        width: '30vw',
    }
}

export { Post };