/* eslint-disable camelcase */
import React from 'react';
import {View, Text, Button} from 'react-native';
import {SplitViewBetween, AddMargin, InnerStyledView, SplitViewAround} from '../style.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const likePost = async (post_id, friend_id) => {
  const jsonValue = await AsyncStorage.getItem('@spacebook_details');
  const userData = JSON.parse(jsonValue);

  return fetch(global.srv_url + '/user/' + friend_id + '/post/' + post_id + '/like', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': userData['token'],
    },
  })
      .then((response) => {
        console.log('Post Liked');
        // Do something
      })
      .catch((err) => {
        console.log(err);
      });
};

const unlikePost = async (post_id, friend_id) => {
  const jsonValue = await AsyncStorage.getItem('@spacebook_details');
  const userData = JSON.parse(jsonValue);

  return fetch(global.srv_url + '/user/' + friend_id + '/post/' + post_id + '/like', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': userData['token'],
    },
  })
      .then((response) => {
        console.log('Post Unliked');
        // Do something
      })
      .catch((err) => {
        console.log(err);
      });
};

const deletePost = async (post_id, friend_id) => {
  const jsonValue = await AsyncStorage.getItem('@spacebook_details');
  const userData = JSON.parse(jsonValue);

  return fetch(global.srv_url + '/user/' + friend_id + '/post/' + post_id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': userData['token'],
    },
  })
      .then((response) => {
        console.log('Post Deleted');
        // Do something
      })
      .catch((err) => {
        console.log(err);
      });
};

const formatDate = (date) => {
  console.log(date);
  const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
  const dateString = new Date(date);
  return dateString.toLocaleDateString('en-US', options);
};

const Post = ({post_id, text, timestamp, numLikes, friend_id, view, updel, update}) => {
  const {updelButtons} = styles;
  let viewButton;
  if (view == undefined) {
    view = false;
  } else {
    viewButton = <Button
      title="View"
      onPress={view}
    />;
  }

  let updateButton;
  let deleteButton;
  let like;
  if (updel == undefined) {
    like =
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
      </SplitViewAround>;
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
          <Text>Date : {formatDate(timestamp)}</Text>
          <Text>Num of Likes {numLikes}</Text>
        </View>
        {like}
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
};

const styles = {
  updelButtons: {
    width: '30vw',
  },
};

export {Post};
