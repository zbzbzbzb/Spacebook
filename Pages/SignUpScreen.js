import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

class SignUpScreen extends Component{
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
  const { signIn } = React.useContext(AuthContext);

  //after request has been sent
 // await AsyncStorage.setItem('@id', jsonValue)
  //await AsyncStorage.setItem('@token', jsonValue)
}

//Might want some validation before setState()
handleEmail = (value) => {
  this.setState({"email":value})
}

  render(){console.log("signup");
    return (
      <View>
      <TextInput
          id="first_name"
          onChangeText={(value)=>this.setState({"first_name":value})}
          value={this.state.first_name}
          />
                      <TextInput
          onChangeText={(value)=>handleEmail(value)}
          value={this.state.second_name}
          />
                      <TextInput
          onChangeText={(value)=>this.setState({"email":value})}
          value={this.state.email}
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
    );
  }
}