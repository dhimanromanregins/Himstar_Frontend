import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import AppLoading from 'expo-app-loading';
import { useFonts, DMSans_400Regular, DMSans_700Bold, DMSans_500Medium } from '@expo-google-fonts/dm-sans';

const primaryColor = '#B94EA0';
const secondaryColor = '#FFFFFF';
const thirdColor = '#000';

const VerifyOtp = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  let [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_700Bold,
    DMSans_500Medium,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleVerify = () => {
    const enteredOtp = otp.join('');
    Alert.alert('OTP Verification', `Entered OTP: ${enteredOtp}`);
    // Navigate to a different screen upon successful verification
    // navigation.navigate('NextScreen');
  };

  return (
    <View style={styles.container}>
      {/* Inserted Image at the top */}
      <Image
        source={require('/home/tanya/Downloads/Himstar-App/Himstar/assets/mobile 1.png')} // Replace with actual path to your image
        style={styles.image}
        resizeMode="contain"
      />
      
      <Text style={styles.title}>OTP</Text>
      <Text style={styles.instructions}>A 6-digit code has been sent to your email</Text>
      
      <View style={styles.otpContainer}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            value={value}
            onChangeText={(text) => {
              const newOtp = [...otp];
              newOtp[index] = text;
              setOtp(newOtp);
            }}
            keyboardType="numeric"
            maxLength={1}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ResendOtp')}>
        <Text style={styles.linkText}>
          <Text style={styles.linkBlackText}>Didn’t Receive Any code? </Text>
          <Text style={styles.linkPrimaryText}>Resend</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', // Center items horizontally
    paddingHorizontal: 20,
    paddingTop: 50, // Add top padding to adjust the starting point
    backgroundColor: secondaryColor,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: primaryColor,
    fontWeight: 'bold',
    fontFamily: 'DMSans_700Bold',
    textAlign: 'center',
  },
  instructions: {
    fontSize: 20,
    color: '#979C93',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'DMSans_700Bold',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  otpInput: {
    height: 50,
    width: 50,
    borderColor: primaryColor,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: secondaryColor,
    textAlign: 'center',
    fontFamily: 'DMSans_400Regular',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 4,
    color: thirdColor,
  },
  button: {
    width: '100%',
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
    fontFamily: 'DMSans_500Medium',
    fontSize: 15,
    color: primaryColor,
    fontWeight: 'bold',
  },
  linkBlackText: {
    color: '#000',
  },
  linkPrimaryText: {
    color: primaryColor,
  },
});

export default VerifyOtp;
