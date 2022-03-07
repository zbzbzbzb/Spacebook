import React from 'react';
import {TextInput, View, Text} from 'react-native';


const SpacebookInput = ({id, label, inputvalue, styleLabel,
  changeText, placeholder, secureTextEntry, multiline, numberOfLines}) => {
  const {inputStyle, labelStyle, containerStyle} = styles;
  if (secureTextEntry == undefined) {
    secureTextEntry = false;
  }

  if (numberOfLines == undefined && multiline == undefined) {
    numberOfLines = 1;
    multiline = false;
  }
  return (
    <View style = {containerStyle}>
      <Text style= {styleLabel ? labelStyle : ''} >{label}</Text>
      <TextInput
        id = {id}
        autoCorrect={false}
        placeholder={placeholder}
        style= {inputStyle}
        value={inputvalue}
        secureTextEntry={secureTextEntry}
        onChangeText = {changeText}
        multiline = {multiline}
        numberOfLines = {numberOfLines}
      />
    </View>
  );
};

const styles ={
  inputStyle: {
    color: '#f2f2f2',
    fontSize: 16,
    color: 'black',
    lineHeight: 23,
    borderBottomColor: '#333',
    borderBottomWidth: 0.5,
    fontFamily: 'System',

  },
  labelStyle: {
    'fontSize': 18,
    'color': 'black',
    'paddingBottom': 10,
    'fontFamily': 'System',
    'position': 'relative',
    ':after': {
      content: '* ',
      position: 'absolute',
      left: 5,
      top: 0,
      color: '#bbb',
    },
  },
  containerStyle: {
    flexDirection: 'column',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#bdbdbd',
  },
};
export {SpacebookInput};
