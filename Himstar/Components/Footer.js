import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const Footer = () => {
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#B94EA0', // Footer background color
    position: 'absolute', // Fixed position
    bottom: 0, // Aligns to the bottom of the screen
    left: 0,
    right: 0,
  },
  button: {
    padding: 10,
  },
  buttonText: {
    color: '#FFFFFF', // Text color
    fontSize: 16,
  },
});

export default Footer;
