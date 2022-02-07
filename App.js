import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

//https://www.npmjs.com/package/react-native-vector-icons
//Entypo

//https://reactnavigation.org/docs/auth-flow/

//Import my own files
import LoginScreen from './Pages/Login.js';
import DrawerScreen from './Pages/DrawerScreen.js';
import SignUpScreen from './Pages/SignUpScreen.js';

const Stack = createStackNavigator();

var isLoggedIn = AsyncStorage.getItem('@spacebook_details');

export default function App({ navigation }){console.log("App");
const [state, dispatch] = React.useReducer(
  (prevState, action) => {
    switch (action.type) {
      case 'RESTORE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'SIGN_IN':
        return {
          ...prevState,
          isSignout: false,
          userToken: action.token,
        };
      case 'SIGN_OUT':
        return {
          ...prevState,
          isSignout: true,
          userToken: null,
        };
    }
  },
  {
    isLoading: true,
    isSignout: false,
    userToken: null,
  }
);

React.useEffect(() => {
  // Fetch the token from storage then navigate to our appropriate place
  const bootstrapAsync = async () => {
    let userToken;

    try {
      // Get Token
      userToken = await SecureStore.getItemAsync('userToken');
    } catch (e) {
      // Restoring token failed
    }

    //Go to Drawer
    dispatch({ type: 'RESTORE_TOKEN', token: userToken });
  };

  bootstrapAsync();
}, []);

const authContext = React.useMemo(
  () => ({
    signIn: async (data) => {
      //Send request to server to sign in
      //get and save token

      dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
    },
    signOut: () => dispatch({ type: 'SIGN_OUT' }),
    signUp: async (data) => {
      //Send request to server to sign up
      //No token to save this should just take us back to sign in
      //or maybe we auto sign em in

      dispatch({ type: 'SIGN_UP', token: 'dummy-auth-token' });
    },
  }),
  []
);

  return(
    <AuthContext.Provider value={authContext}>
       <NavigationContainer>
    <Stack.Navigator>
    {state.userToken == null ? (//not isAuthenticated
      <>
        <Stack.Screen
          name="SignIn"
          component={LoginScreen}
          options={{
            title: 'Sign in',
            animationTypeForReplace: state.isSignout ? 'pop' : 'push',
          }}
        />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </>
    ) : (//isAuthenticated
      <>
        <Stack.Screen name="Drawer" component={DrawerScreen} />
      </>
    )}
   </Stack.Navigator>
   </NavigationContainer>
   </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/*
expo install expo-secure-store


*/
