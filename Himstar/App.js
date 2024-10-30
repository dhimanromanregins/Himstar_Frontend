import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Components/Login'; // Adjust this path
import Register from './Components/Register'; // Adjust this path
import Registertwo from './Components/Registertwo';
import FinalRegister from './Components/FinalRegister';
import VerifyOtp from './Components/VerifyOtp';
import Contact from './Components/Contact';
import Home from './Components/Home';
import Footer from './Components/Footer';
const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        // Uncomment and adjust the path to your custom fonts as needed
        // 'dm-sans': require('./assets/fonts/DMSans-Regular.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // You can return a loading spinner or a splash screen while fonts are loading
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Registertwo" component={Registertwo} />
        <Stack.Screen name="FinalRegister" component={FinalRegister} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
        <Stack.Screen name="Contact" component={Contact} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Footer" component={Footer} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
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
