import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        super(props);

        this.state = {
            email: "zfbobat@gmail.co.uk",
            password: "zahir123",
        };
    }


    Save = () => {

        fetch('http://localhost:3333/api/1.0.0/login', {
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
                this.props.navigation.navigate("Drawer");
            })
            .catch((error) => {
                console.log(error);
            })

        console.log(this.state);

    }

    render() {
        console.log("login");
        return (
            <View>
                <TextInput
                    placeholder="Enter email"
                    onChangeText={(email) => this.setState({ "email": email })}
                    value={this.state.email}
                />
                <TextInput
                    placeholder="Enter password"
                    onChangeText={(password) => this.setState({ "password": password })}
                    value={this.state.password}
                />

                <Button
                    title="Log In"
                    onPress={this.Save}
                />
            </View>
        )
    }
}

export default LoginScreen;