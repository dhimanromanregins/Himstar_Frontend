import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';
import AppLoading from 'expo-app-loading';
import { useFonts, DMSans_400Regular, DMSans_700Bold } from '@expo-google-fonts/dm-sans';

const primaryColor = '#B94EA0';
const secondaryColor = '#FFFFFF';
const thirdColor = '#000';
// Importing the background image
import BackgroundImage from '../assets/Frame 11.png'; // Update the path if needed

const FinalRegister = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  let [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleRegister = () => {
    if (password && confirmPassword) {
      if (password === confirmPassword) {
        setLoading(true);
        // Logic for the final registration action
        setTimeout(() => {
          setLoading(false);
          navigation.navigate('Home'); // Update with the actual home screen or main app screen name
        }, 2000);
      } else {
        alert("Passwords do not match!");
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={BackgroundImage} style={styles.backgroundImage} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />
        <Text style={styles.title}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
          secureTextEntry
        />
        
        {loading ? (
          <ActivityIndicator size="large" color={primaryColor} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
          <Text style={styles.linkText}>
            <Text style={styles.linkBlackText}>Already have an Account? </Text>
            <Text style={styles.linkPrimaryText}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: secondaryColor,
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: 150, // Adjusted height
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start', // Keeps content aligned at the top
    padding: 20,
    width: '100%',
    maxWidth: 400,
    marginTop: 15, // Added margin to create space after the image
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
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
    marginBottom: 15,
    width: '100%',
    fontFamily: 'DMSans_400Regular',
  },
  button: {
    width: '100%',
    backgroundColor: primaryColor,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: secondaryColor,
    fontSize: 18,
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

export default FinalRegister;
