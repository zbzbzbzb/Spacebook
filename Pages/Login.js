import React, {Component} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoginScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            first_name : "",
            second_name : "",
            email : "",
            password : "",
            type : ""
        }
    }


Save = () => {
    //get data out of state
    //send to server
    console.log(this.state);

    //after request has been sent
   // await AsyncStorage.setItem('@id', jsonValue)
    //await AsyncStorage.setItem('@token', jsonValue)
}

//Might want some validation before setState()
handleEmail = (value) => {
    this.setState({"email":value})
}

SignUp = (value) =>{
    
}

Register = (value) =>{
    
}

render(){
    return(
        <View>
            <Button
                title="Sign Up"
                onPress={this.SignUp}
                />
                <Button
                title="Register"
                onPress={this.Register}
                />

            <TextInput
                id="first_name"
                onChangeText={(value)=>this.setState({"first_name":value})}
                value={this.state.first_name}
                />
                            <TextInput
                onChangeText={(value)=>this.setState({"second_name":value})}
                value={this.state.second_name}
                />
                            <TextInput
                onChangeText={(value)=>this.setState({"email":value})}
                value={this.handleEmail}
                />
                            <TextInput
                onChangeText={(value)=>this.setState({"password":value})}
                value={this.state.password}
                />

                <Button
                title="Save"
                onPress={this.Save}
                />
        </View>
    )
}
}

export default LoginScreen ;