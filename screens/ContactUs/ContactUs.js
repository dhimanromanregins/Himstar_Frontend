import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Animated, Modal } from 'react-native';
import GlobalFont from 'react-native-global-font';
import { contactUs } from '../../actions/ApiActions';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';


const Contact = ({ navigation }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    message: '',
  });
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const errorAnimation = useRef(new Animated.Value(-100)).current;
  const [loading, setLoading] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  useFocusEffect(
    useCallback(() => {
      return () => {
        setFormData({
          full_name: '',
          email: '',
          phone_number: '',
          message: '',
        });
        setErrorMessage('');
        setSuccessMessage('');
        setIsErrorVisible(false);
        setErrors({});
        setLoading(false);
      };
    }, [])
  );

  useEffect(() => {
    async function loadFonts() {
      GlobalFont.applyGlobal('DMSans_400Regular');
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color={'#B94EA0'} style={{ flex: 1, justifyContent: 'center' }} />;
  }

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateStep = () => {
    const newErrors = {};
    if (!formData.full_name) {
      newErrors.full_name = 'Name is required.';
    }
    else if(formData.full_name.length < 3){
      newErrors.full_name = 'Name must be at least 3 characters long.';
    }
    if (!formData.phone_number) {
      newErrors.phone_number = 'Phone number is required.';
    }
    else if (!phoneRegex.test(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid 10-digit phone number.';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required.';
    }
    else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.message) {
      newErrors.message = 'Message is required.';
    }
    else if (formData.message.length < 50) {
      newErrors.message = 'Message must be at least 50 characters long.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async() => {
    if (!validateStep()){
      return;
    }
    setLoading(true);
    const result = await contactUs(navigation, formData);
    let errorMsg;
    let successMsg = false;
    if (!result){
      errorMsg = 'Something went wrong.';
      setErrorMessage(errorMsg);
      setIsErrorVisible(true);
    }
    else if (result[0] === 201) {
      successMsg = true;
      setSuccessMessage('Contact information submitted successfully!');
      setIsErrorVisible(true);
    }
    else {
      if (typeof (result[1]) === 'object') {
        const firstKey = Object.keys(result[1])[0];
        errorMsg = result[1][firstKey];
      }
      else {
        errorMsg = result[1];
      }
      setErrorMessage(errorMsg);
      setIsErrorVisible(true);
    }
    if (errorMsg || successMsg) {
      Animated.timing(errorAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(errorAnimation, {
          toValue: -100,
          duration: 500,
          useNativeDriver: true,
        }).start(() =>{ setIsErrorVisible(false); setErrorMessage(''); setSuccessMessage('')});
        if (successMsg){
          navigation.navigate('HomeTabs');
        }
      }, 2000);
    }
    if (!successMsg){
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backButton}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={'#B94EA0'} />
        </TouchableOpacity>
      </View>

      {isErrorVisible && (
        <Animated.View style={[styles.apiErrorContainer, { transform: [{ translateY: errorAnimation }], backgroundColor: successMessage ? 'green' : 'red' }]}>
          <Text style={styles.apiErrorText}>{errorMessage || successMessage}</Text>
        </Animated.View>
      )}
      <View style={styles.centeredContainer}>
        <Text style={styles.title}>Reach out to us</Text>
        <Text style={styles.subtitle}>
          Feel free to contact us and we will get back to you as soon as we can.
        </Text>
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={formData.full_name}
        onChangeText={(text) => handleInputChange('full_name', text)}
        placeholder="Enter your name"
        maxLength={50}
      />
      {errors.full_name && <Text style={styles.errorText}>{errors.full_name}</Text>}

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={formData.phone_number}
        onChangeText={(text) => handleInputChange('phone_number', text)}
        placeholder="Enter your phone number"
        keyboardType="numeric"
        maxLength={10}
      />
      {errors.phone_number && <Text style={styles.errorText}>{errors.phone_number}</Text>}

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={formData.email}
        onChangeText={(text) => handleInputChange('email', text)}
        placeholder="Enter your email"
        keyboardType="email-address"
        maxLength={100}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <Text style={styles.label}>Message</Text>
      <TextInput
        style={styles.messageInput}
        value={formData.message}
        onChangeText={(text) => handleInputChange('message', text)}
        placeholder="Your message"
        multiline
        numberOfLines={4}
        maxLength={500}
      />
      {errors.message && <Text style={styles.errorText}>{errors.message}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <View style={styles.addressContainer}>
        <Text style={styles.addressTitle}>For More Info:</Text>
        <Text style={styles.addressDetails}>
          Flat 12, The Grand Plaza, 123 High St, London, UK, WC1 56789
        </Text>

        <View style={styles.contactInfoContainer}>
          <View style={styles.managerContainer}>
            <Text style={styles.managerPhones}>Manager Phones:</Text>
            <Text style={styles.addressDetails}>+44 20 123 4568</Text>
          </View>
          <View style={styles.emailContainer}>
            <Text style={styles.emailDetails}>Emails:</Text>
            <Text style={styles.addressDetails}>
              events@fiddle.co{"\n"}
              manager@fiddle.co
            </Text>
          </View>
        </View>
      </View>
      <Modal transparent={true} animationType="fade" visible={loading}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={'#B94EA0'} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 25,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
  },
  apiErrorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 15,
    zIndex: 1000000,
  },
  apiErrorText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  centeredContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#B94EA0',
    fontWeight: 'bold',
    fontFamily: 'DMSans_700Bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'DMSans_400Regular',
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: '#000',
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
    width: '100%',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
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
    width: '100%',
  },
  button: {
    backgroundColor: '#B94EA0',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  addressContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  addressTitle: {
    fontSize: 18,
    color: '#B94EA0',
    fontWeight: 'bold',
    fontFamily: 'DMSans_700Bold',
  },
  addressDetails: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'DMSans_400Regular',
    textAlign: 'center',
  },
  contactInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  managerContainer: {
    flex: 1,
    alignItems: 'flex-start',
    paddingRight: 10,
  },
  emailContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingLeft: 10,
  },
  managerPhones: {
    fontSize: 16,
    color: '#B94EA0',
    fontFamily: 'DMSans_500Medium',
    marginBottom: 5,
  },
  emailDetails: {
    fontSize: 16,
    color: '#B94EA0',
    fontFamily: 'DMSans_500Medium',
    marginBottom: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default Contact;
