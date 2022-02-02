import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

//Import my own files
import HomeScreen from './Homescreen.js' ;
import SettingsScreen from './Settings.js' ;
import ProfileScreen from './Profile.js' ;

const Drawer = createDrawerNavigator();

function LogOut(){
  const { signOut } = React.useContext(AuthContext);
}

export default function DrawerScreen() {

  return (
    <View>
        <Drawer.Navigator>
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Settings" component={SettingsScreen} />
          <Drawer.Screen name="Profile" component={ProfileScreen} />
          
        </Drawer.Navigator>
        <Button
                title="Log Out"
                onPress={this.LogOut}
                />
    </View>
  );
}