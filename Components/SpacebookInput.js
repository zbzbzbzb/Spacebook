import React, {Component} from 'react';
import {TextInput, View, Text} from 'react-native';

const SpacebookInput = ({ id, label , inputvalue,styleLabel, changeText, placeholder, secureTextEntry}) => {
    const {inputStyle, labelStyle, containerStyle} = styles;
    if(secureTextEntry == undefined){
        secureTextEntry = false;
    }
    return(
        <View style = {containerStyle}>
            <Text style= {styleLabel ? labelStyle : ""} >{label}</Text>
            <TextInput 
               id = {id}
               autoCorrect={false}
               placeholder={placeholder}
               style= {inputStyle}
               value={inputvalue}
               secureTextEntry={secureTextEntry}
               onChangeText = {changeText}
            />
        </View>
    );
 }

const styles ={
    inputStyle:{
        color: '#333',
        fontSize: 16,
        lineHeight: 23,  
        borderBottomColor: '#333',
        borderBottomWidth: 0.5,
        fontFamily: 'System',
        
    },
    labelStyle:{
        fontSize: 18,
        color: 'black',
        paddingBottom: 10,
        fontFamily: 'System',
        position: 'relative',
        ':after': {
           content: '* ',
           position: 'absolute',
           left: 5,
           top: 0,
           color: '#bbb'
        }
    },
    containerStyle:{
        flexDirection: 'column',
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#bdbdbd'
    }
}
export { SpacebookInput };