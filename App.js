import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//https://www.npmjs.com/package/react-native-vector-icons
//Entypo

//https://reactnavigation.org/docs/auth-flow/

//Import my own files
import LoginScreen from './Pages/Login.js';
import DrawerScreen from './Pages/DrawerScreen.js';
import SignUpScreen from './Pages/SignUpScreen.js';

const AuthContext = React.createContext();

const Stack = createStackNavigator();

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
      // Restore token stored in `SecureStore` or any other encrypted storage
      // userToken = await SecureStore.getItemAsync('userToken');
    } catch (e) {
      // Restoring token failed
    }

    // After restoring token, we may need to validate it in production apps

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    dispatch({ type: 'RESTORE_TOKEN', token: userToken });
  };

  bootstrapAsync();
}, []);

const authContext = React.useMemo(
  () => ({
    signIn: async (data) => {
      // In a production app, we need to send some data (usually username, password) to server and get a token
      // We will also need to handle errors if sign in failed
      // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
      // In the example, we'll use a dummy token

      dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
    },
    signOut: () => dispatch({ type: 'SIGN_OUT' }),
    signUp: async (data) => {
      // In a production app, we need to send user data to server and get a token
      // We will also need to handle errors if sign up failed
      // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
      // In the example, we'll use a dummy token

      dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
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
