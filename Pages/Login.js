import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SpacebookInput } from '../Components/SpacebookInput.js';

const storeData = async (value) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('@spacebook_details', jsonValue)
    } catch (e) {
        console.error(error);
    }
}

class LoginScreen extends Component {
    constructor(props) {
        super(props);console.log(props);
       // const {autoLogin, signUpEmail, signUpPassword} = route.params;
        
        // if(autoLogin){
        //     this.state = {
        //         email: signUpEmail,
        //         password: signUpPassword,
        //     };
        //     this.Save;
        // }

        this.state = {
            email: "zfbobat@gmail.co.uk",
            password: "zahir123",
            //email: "don@ali.com",
            //password: "donali",
        };
    }

    signUp = () => {
        this.props.navigation.navigate("SignUp");
    }

    Save = () => {

        fetch(global.srv_url + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                storeData(json);
                this.props.navigation.navigate("Homescreen");
            })
            .catch((error) => {
                console.log(error);
            })

        console.log(this.state);

    }

    render() {
        console.log("login");
        return (
            <View style={{ height: '100%', flex: 1, justifyContent: 'center' }}>

                <SpacebookInput
                    id="email"
                    autoCorrect={false}
                    label="Email"
                    changeText={(value) => this.setState({ "email": value })}
                    inputvalue={this.state.email}
                />

                <SpacebookInput
                    id="password"
                    autoCorrect={false}
                    label="Password"
                    secureTextEntry={true}
                    changeText={(value) => this.setState({ "password": value })}
                    inputvalue={this.state.password}
                />
                <Button
                    title="Log In"
                    onPress={this.Save}
                />
                <Button
                    title="Sign Up"
                    onPress={this.signUp}
                />
            </View>
        )
    }
}

export default LoginScreen;