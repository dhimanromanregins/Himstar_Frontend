// Contact.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AppLoading from 'expo-app-loading';
import { useFonts, DMSans_400Regular, DMSans_700Bold, DMSans_500Medium } from '@expo-google-fonts/dm-sans';

const primaryColor = '#B94EA0';
const secondaryColor = '#FFFFFF';
const thirdColor = '#000';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  let [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_700Bold,
    DMSans_500Medium,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleSubmit = () => {
    Alert.alert('Contact Form Submitted', `Name: ${name}\nEmail: ${email}\nMessage: ${message}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContainer}>
        <Text style={styles.title}>Reach out to us</Text>
        <Text style={styles.subtitle}>
          Feel free to contact us and we will get back to you as soon as we can.
        </Text>
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Message</Text>
      <TextInput
        style={styles.messageInput}
        value={message}
        onChangeText={setMessage}
        placeholder="Your message"
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      {/* Static Address Details */}
      <View style={styles.addressContainer}>
        <Text style={styles.addressTitle}>For More Info:</Text>
        <Text style={styles.addressDetails}>
          Flat 12, The Grand Plaza, 123 High St, London, UK, WC1 56789
        </Text>

        {/* Manager Phones and Emails Side by Side */}
        <View style={styles.contactInfoContainer}>
          <View style={styles.managerContainer}>
            <Text style={styles.managerPhones}>Manager Phones:</Text>
            <Text style={styles.addressDetails}>+44 20 123 4568</Text>
          </View>
          <View style={styles.emailContainer}>
            <Text style={styles.emailDetails}>Emails:</Text>
            <Text style={styles.addressDetails}>
              events@fiddle.co{"\n"}
              menager@fiddle.co
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Ensure content starts from the top
    padding: 20,
    backgroundColor: secondaryColor,
    paddingTop: 10, // Reduced top padding for less space
  },
  centeredContainer: {
    alignItems: 'center', // Center align the title and subtitle
    marginBottom: 10, // Space below the centered text
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: primaryColor, // Set title color to primary color
    fontWeight: 'bold',
    fontFamily: 'DMSans_700Bold',
    textAlign: 'center', // Center align text
  },
  subtitle: {
    fontSize: 16,
    color: thirdColor,
    fontFamily: 'DMSans_400Regular',
    textAlign: 'center', // Center align text
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: thirdColor,
    fontFamily: 'DMSans_500Medium',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
    fontFamily: 'DMSans_400Regular',
    width: '100%', // Ensure the input takes the full width
  },
  messageInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
    fontFamily: 'DMSans_400Regular',
    width: '100%', // Ensure the message input takes the full width
  },
  button: {
    backgroundColor: primaryColor,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    width: '100%', // Ensure the button takes the full width
  },
  buttonText: {
    color: secondaryColor,
    fontWeight: 'bold',
    fontSize: 18,
  },
  addressContainer: {
    marginTop: 20, // Space above the address
    alignItems: 'center', // Center the address text
  },
  addressTitle: {
    fontSize: 18,
    color: primaryColor,
    fontWeight: 'bold',
    fontFamily: 'DMSans_700Bold',
  },
  addressDetails: {
    fontSize: 16,
    color: thirdColor,
    fontFamily: 'DMSans_400Regular',
    textAlign: 'center', // Center align address text
  },
  contactInfoContainer: {
    flexDirection: 'row', // Arrange items side by side
    justifyContent: 'space-between', // Space between items
    width: '100%', // Full width for the container
    marginTop: 10, // Space above the contact info
  },
  managerContainer: {
    flex: 1, // Take equal space for manager info
    alignItems: 'flex-start', // Align to the left
    paddingRight: 10, // Space on the right for padding
  },
  emailContainer: {
    flex: 1, // Take equal space for email info
    alignItems: 'flex-end', // Align to the right
    paddingLeft: 10, // Space on the left for padding
  },
  managerPhones: {
    fontSize: 16,
    color: primaryColor, // Optional: make the manager phones stand out
    fontFamily: 'DMSans_500Medium',
    marginBottom: 5, // Space below the title
  },
  emailDetails: {
    fontSize: 16,
    color: primaryColor, // Optional: make the emails stand out
    fontFamily: 'DMSans_500Medium',
    marginBottom: 5, // Space below the title
  },
});

export default Contact;
