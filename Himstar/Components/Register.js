import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import AppLoading from 'expo-app-loading';
import { useFonts, DMSans_400Regular, DMSans_700Bold, DMSans_500Medium } from '@expo-google-fonts/dm-sans';
import googleIcon from '../assets/google-img.png'; // Adjust this path based on your file structure

const primaryColor = '#B94EA0';
const secondaryColor = '#FFFFFF';
const thirdColor = '#000';

const Register = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  let [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_700Bold,
    DMSans_500Medium,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleNext = () => {
    // Navigate to the RegisterTwo component
    navigation.navigate('Registertwo'); // Make sure 'RegisterTwo' matches the route name defined in your navigator
  };

  const handleGoogleSignIn = () => {
    Alert.alert('Sign in with Google clicked!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Username</Text>
      <TextInput style={styles.input} value={username} placeholder={username}onChangeText={setUsername} />

      <Text style={styles.title}>Full Name</Text>
      <TextInput style={styles.input} value={fullName} placeholder={fullName} onChangeText={setFullName} />

      <Text style={styles.title}>Email</Text>
      <TextInput style={styles.input} value={email}  placeholder={email} onChangeText={setEmail} />

      <View style={styles.spacer} />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
        <Text style={styles.linkText}>
          <Text style={styles.linkBlackText}>Already have an Account? </Text>
          <Text style={styles.linkPrimaryText}>Log In</Text>
        </Text>
      </TouchableOpacity>
      <View style={styles.separatorContainer}>
        <View style={styles.separator} />
        <Text style={styles.separatorText}>or</Text>
        <View style={styles.separator} />
      </View>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <View style={styles.googleButtonContent}>
          <Image source={googleIcon} style={styles.googleIcon} />
          <Text style={styles.googleButtonText}> Google Account</Text>
        </View>
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
    width: '100%', // Use full width for the input
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
    width: 300,
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
    width: '100%', // Use full width for the button
    alignSelf: 'center',
    backgroundColor: '#FFFFFF', // Set background color to white
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 15,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow offset
    shadowOpacity: 0.2, // Adjust shadow opacity for a more pronounced effect
    shadowRadius: 5, // Adjust shadow radius
    elevation: 5, // For Android shadow
    borderColor: primaryColor, // Keep the border color as primary
    borderWidth: 1,
  },
  buttonText: {
    color: primaryColor, // Change text color to primary color
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'DMSans_700Bold',
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'DMSans_700Bold',
  },
  linkBlackText: {
    color: '#000',
  },
  linkPrimaryText: {
    color: primaryColor,
    fontWeight: 'bold',
  },
});

export default Register;
