// RegisterTwo.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AppLoading from 'expo-app-loading';
import { useFonts, DMSans_400Regular, DMSans_700Bold, DMSans_500Medium } from '@expo-google-fonts/dm-sans';

const primaryColor = '#B94EA0';
const secondaryColor = '#FFFFFF';
const thirdColor = '#000';

const RegisterTwo = ({ navigation }) => {
  const [zipCode, setZipCode] = useState('');
  const [dob, setDob] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');

  let [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_700Bold,
    DMSans_500Medium,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleNext = () => {
    navigation.navigate('FinalRegister'); // Make sure 'FinalRegister' matches the route name defined in your navigator
  };
  const renderRadioButton = (label) => (
    <TouchableOpacity
      style={styles.radioButton}
      onPress={() => setGender(label)}
    >
      <View style={[styles.radioCircle, gender === label && styles.selectedCircle]} />
      <Text style={styles.radioText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ZIP Code</Text>
      <TextInput
        style={styles.input}
        value={zipCode}
        onChangeText={setZipCode}
        keyboardType="numeric"
        placeholder="Enter ZIP Code"
      />

      <Text style={styles.title}>Date of Birth</Text>
      <TextInput
        style={styles.input}
        value={dob}
        onChangeText={setDob}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.title}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        placeholder="Enter Phone Number"
      />

      <Text style={styles.title}>Gender</Text>
      <View style={styles.radioContainer}>
        {renderRadioButton('Male')}
        {renderRadioButton('Female')}
        {renderRadioButton('Other')}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
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
    width: '100%',
  },
  button: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderColor: primaryColor,
    borderWidth: 1,
  },
  buttonText: {
    color: primaryColor,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'DMSans_700Bold',
  },
  radioContainer: {
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: thirdColor,
    marginRight: 10,
  },
  selectedCircle: {
    backgroundColor: primaryColor,
  },
  radioText: {
    fontSize: 16,
    color: thirdColor,
    fontFamily: 'DMSans_500Medium',
  },
});

export default RegisterTwo;
