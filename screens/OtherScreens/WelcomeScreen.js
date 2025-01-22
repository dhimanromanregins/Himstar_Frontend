import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (



    <View style={styles.container}>
    <ImageBackground 
      source={require('./../../assets/images/welcome-screen.png')} // Replace with your image
      style={styles.image}
      resizeMode="cover"
    >
      {/* Welcome Text */}
      <View style={styles.textWrapper}>
        <Text style={styles.welcomeText}>Welcome </Text>
      
      </View>

      {/* Button */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.buttonText}>Let's Go</Text>
      </TouchableOpacity>
    </ImageBackground>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'space-between', // Distributes content vertically
  },
  textWrapper: {
    marginTop: 90,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 36,
    color: '#fff',
    textAlign: 'center',
    textTransform:'capitalize',
    fontFamily: 'DMSans_400Regular',
    
  },
  subText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 90, // Spacing from bottom
    width: 332, // Set fixed width to 332px
    justifyContent: 'center', // Ensure the text is centered vertically
    alignItems: 'center', // Ensure the text is centered horizontally
  },
  
  buttonText: {
    color: '#B94EA0',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'DMSans_700Bold',
    textAlign: 'center', // Center the text horizontally
  },
  
});

export default WelcomeScreen;
