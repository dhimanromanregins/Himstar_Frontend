// Login.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import AppLoading from 'expo-app-loading';
import { useFonts, DMSans_400Regular, DMSans_700Bold, DMSans_500Medium } from '@expo-google-fonts/dm-sans';
import Icon from 'react-native-vector-icons/MaterialIcons';

const primaryColor = '#B94EA0';
const secondaryColor = '#FFFFFF';
const thirdColor = '#000';

import googleIcon from '../assets/google-img.png';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  let [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_700Bold,
    DMSans_500Medium,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleLogin = () => {
    Alert.alert(`Email: ${username}`, `Password: ${password}`);
  };

  const handleGoogleSignIn = () => {
    Alert.alert('Sign in with Google clicked!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Email</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Enter your email"
      />

      <Text style={styles.title}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          value={password}
          placeholder="Enter your password"
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconContainer}>
          <Icon
            name={showPassword ? 'visibility' : 'visibility-off'}
            size={24}
            color={thirdColor}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.spacer} />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Get started</Text>
      </TouchableOpacity>

      {/* Navigate to Register screen */}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>
          <Text style={styles.linkBlackText}>Don't have an Account? </Text>
          <Text style={styles.linkPrimaryText}>Create Account</Text>
        </Text>
      </TouchableOpacity>

      {/* Separator Line */}
      <View style={styles.separatorContainer}>
        <View style={styles.separator} />
        <Text style={styles.separatorText}>or</Text>
        <View style={styles.separator} />
      </View>

      {/* Sign in with Google Button */}
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <View style={styles.googleButtonContent}>
          <Image
            source={googleIcon}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}> Google Account</Text>
        </View>
      </TouchableOpacity>

      {/* Navigate to OTP Page Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('VerifyOtp')}>
        <Text style={styles.buttonText}>Go to OTP Page</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>

      {/* Navigate to Contact Page Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Contact')}>
        <Text style={styles.buttonText}>Contact Us</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: secondaryColor,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    color: thirdColor,
    fontWeight: 'bold',
    fontFamily: 'DMSans_700Bold',
  },
  input: {
    height: 45,
    borderColor: '#fff',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginBottom: 15,
    fontFamily: 'DMSans_400Regular',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 4,
    width: '100%', // Full-width input
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
    height: 45,
    borderColor: '#fff',
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginBottom: 15,
    fontFamily: 'DMSans_400Regular',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 4,
    width: '100%', // Full-width input
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  spacer: {
    height: 20,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: primaryColor,
    marginHorizontal: 10,
  },
  separatorText: {
    fontSize: 16,
    color: thirdColor,
    fontFamily: 'DMSans_500Medium',
  },
  googleButton: {
    width: '100%', // Full-width button
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: primaryColor,
    borderRadius: 10,
    marginVertical: 15,
    paddingVertical: 10,
    alignItems: 'center',
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: primaryColor,
    fontWeight: 'bold',
    fontFamily: 'DMSans_700Bold',
    fontSize: 16,
  },
  button: {
    width: '100%', // Full-width button
    alignSelf: 'center',
    backgroundColor: primaryColor,
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 15,
  },
  buttonText: {
    color: secondaryColor,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'DMSans_700Bold',
  },
  linkText: {
    marginTop: 15,
    textAlign: 'center',
    fontFamily: 'DMSans_700Bold',
    fontSize: 15,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  linkBlackText: {
    color: '#000',
  },
  linkPrimaryText: {
    color: primaryColor,
  },
});

export default Login;
