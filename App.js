import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//https://www.npmjs.com/package/react-native-vector-icons
//Entypo

//https://reactnavigation.org/docs/4.x/auth-flow/

//Import my own files
import LoginScreen from './Pages/Login.js';
import DrawerScreen from './Pages/DrawerScreen.js';
import AuthLoadingScreen from './Pages/AuthLoadingScreen.js';

export default function App(){
    createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: DrawerScreen,
      Auth: LoginScreen,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
}

// export default function App() {
//   if(isAuthenticated){
//     this.props.navigation.navigate(DrawerScreen)
//   }else{
//   return (
//     <NavigationContainer>
//         <Stack.Navigator>
//           <Stack.Screen name="Login" component={LoginScreen} />
//           {/* <Stack.Screen name="Drawer" component={DrawerScreen} /> */}
//         </Stack.Navigator>
//     </NavigationContainer>
//   );}
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/*
install stack navigator
maybe drawer
npm install @react-native-async-storage/async-storage

*/
