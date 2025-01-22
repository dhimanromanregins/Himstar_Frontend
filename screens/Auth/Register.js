import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View,Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, ScrollView, Image, ToastAndroid, ActivityIndicator, Modal } from 'react-native';
import GlobalFont from 'react-native-global-font';
import googleIcon from '../../assets/images/google-img.png';
import { useFocusEffect } from '@react-navigation/native';
import { userRegistration, userGoogleRegistration } from '../../actions/ApiActions';
import dayjs from 'dayjs';
import DateTimePicker from 'react-native-ui-datepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Register = ({ navigation }) => {
  useEffect(() => {
    GlobalFont.applyGlobal('DMSans_400Regular');
  }, []);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    zipcode: '',
    dob: '',
    phonenumber: '',
    gender: '',
    password: '',
    confirm_password: '',
    ref_code: '',
  });
  const [dobPickerVisible, setDobPickerVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const date = dayjs();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setFormData({
          username: '',
          fullName: '',
          email: '',
          zipcode: '',
          dob: '',
          phoneNumber: '',
          gender: '',
          password: '',
          confirmPassword: '',
        });
        setStep(1);
        setErrors({});
        setLoading(false);
        setDobPickerVisible(false);
      };
    }, [])
  );

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{5,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  const zipCodeRegex = /^[0-9]{1,6}$/;

  const validateStep = () => {
    const newErrors = {};
    switch (step) {
      case 1:
        if (!formData.username) {
          newErrors.username = 'Username is required.';
        } else if (!usernameRegex.test(formData.username)) {
          newErrors.username = 'Username must be at least 6 characters long and start with a letter.';
        }

        if (!formData.fullName) {
          newErrors.fullName = 'Full name is required.';
        } else if (formData.fullName.length < 3) {
          newErrors.fullName = 'Full name must be at least 3 characters long.';
        }

        if (!formData.email) {
          newErrors.email = 'Email is required.';
        } else if (!emailRegex.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address.';
        }
        break;

      case 2:
        if (!formData.zipcode) {
          newErrors.zipcode = 'Zip code is required.';
        } else if (!zipCodeRegex.test(formData.zipcode)) {
          newErrors.zipcode = 'Zip code must be a 6-digit integer.';
        }

        if (!formData.dob) {
          newErrors.dob = 'Date of Birth is required.';
        }

        if (!formData.phonenumber) {
          newErrors.phonenumber = 'Phone number is required.';
        } else if (!phoneRegex.test(formData.phonenumber)) {
          newErrors.phonenumber = 'Please enter a valid 10-digit phone number.';
        }

        if (!formData.gender) newErrors.gender = 'Please select a gender.';
        break;

      case 3:
        if (!formData.password) newErrors.password = 'Password is required.';
        if (formData.password.length < 6) newErrors.confirm_password = 'Password length must be greater than or equal to 6.';
        if (!formData.confirm_password) newErrors.confirm_password = 'Confirm password is required.';
        if (formData.password !== formData.confirm_password) {
          newErrors.confirm_password = 'Passwords do not match.';
        }
        break;

      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        handleRegister();
      }
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    const result = await userRegistration(formData);
    let errorMsg;
    if (result[0] === 200) {
      ToastAndroid.show(result[1].message, ToastAndroid.SHORT);
      navigation.navigate('OtpVerify', { userData: formData });
      setLoading(false);
    }
    else {
      if (typeof (result[1]) === 'object') {
        const firstKey = Object.keys(result[1])[0];
        errorMsg = result[1][firstKey];
      }
      else {
        errorMsg = result[1];
      }
      ToastAndroid.show(typeof(errorMsg) == 'object' ? errorMsg[0] : errorMsg, ToastAndroid.SHORT);
    }
    setLoading(false);
  };

  const handleGoogleRegister = async () => {
    try {
      setLoading(true);
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo?.type === 'cancelled'){
        setLoading(false);
        return;
      }
      const result = await userGoogleRegistration({ token: userInfo?.data?.idToken });
      console.log('result>>>', result);
      let errorMsg;
      let successMsg = false;
      if (result[0] === 200 || result[0] === 201) {
        successMsg = true;
        await AsyncStorage.setItem('AuthToken', result[1]?.access ?? '');
        await AsyncStorage.setItem('AuthUser', result[1]?.username ?? '');
        await AsyncStorage.setItem('AuthId', String(result[1]?.user_id ?? ''));
        await AsyncStorage.setItem('RegAuthId', String(result[1]?.reg_user_id ?? ''));
        await AsyncStorage.setItem('AuthEmail', result[1]?.email ?? '');
        await AsyncStorage.setItem('AuthName', result[1]?.name ?? '');
        await AsyncStorage.setItem('AuthPhone', result[1]?.phone ?? '');
        await AsyncStorage.setItem('AuthImage', result[1]?.profile_image ?? '');
        ToastAndroid.show('Login successfully.', ToastAndroid.SHORT);
        setLoading(false);
        navigation.navigate('HomeTabs');
      }
      else {
        if (typeof (result[1]) === 'object') {
          const firstKey = Object.keys(result[1])[0];
          errorMsg = result[1][firstKey];
        }
        else {
          errorMsg = result[1];
        }
        ToastAndroid.show(typeof(errorMsg) == 'object' ? errorMsg[0] : errorMsg, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log('Google sign in error>>>>>', error);
      ToastAndroid.show('Something went wrong.', ToastAndroid.SHORT);
    }
    finally {
      setLoading(false);
    }
  };

  const renderRadioButton = (label) => (
    <TouchableOpacity
      style={styles.radioButton}
      onPress={() => handleInputChange('gender', label.toLowerCase())}
    >
      <View style={[styles.radioCircle, formData.gender === label.toLowerCase() && styles.selectedCircle]} />
      <Text style={styles.radioText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
  behavior="padding"
  style={{ flex: 1 }}
>
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>

      {step === 1 && (
        <>
          <Text style={styles.title}>Username</Text>
          <TextInput
            style={styles.input}
            value={formData.username}
            onChangeText={(text) => handleInputChange('username', text)}
            maxLength={50}
          />
          {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

          <Text style={styles.title}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={formData.fullName}
         
            onChangeText={(text) => handleInputChange('fullName', text)}
            maxLength={50}
          />
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

          <Text style={styles.title}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
           
            onChangeText={(text) => handleInputChange('email', text)}
            maxLength={150}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.title}>ZIP Code</Text>
          <TextInput
            style={styles.input}
            value={formData.zipcode}
            onChangeText={(text) => handleInputChange('zipcode', text)}
            keyboardType="numeric"
         
            maxLength={6}
          />
          {errors.zipcode && <Text style={styles.errorText}>{errors.zipcode}</Text>}

          <Text style={styles.title}>Date of Birth</Text>
          <TouchableOpacity onPress={() => setDobPickerVisible(!dobPickerVisible)}>
            <TextInput
              style={styles.input}
              value={formData.dob}
        
              editable={false}
              maxLength={10}
            />
          </TouchableOpacity>
          {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}

          {dobPickerVisible && (
            <DateTimePicker
              mode="single"
              date={date}
              onChange={(params) => {
                const selectedDate = new Date(params.date);
                const currentDate = new Date();
                if (!isNaN(selectedDate)) {
                  if (selectedDate > currentDate) {
                    setErrors({ ...errors, dob: 'Date cannot be in the future.' });
                  }
                  else {
                    handleInputChange('dob', dayjs(selectedDate).format('YYYY-MM-DD'))
                    setDobPickerVisible(false);
                  }
                } else {
                  ToastAndroid.show('Something went wrong.', ToastAndroid.SHORT);
                }
              }}
            />
          )}

          <Text style={styles.title}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={formData.phonenumber}
            onChangeText={(text) => handleInputChange('phonenumber', text)}
            keyboardType="phone-pad"
         
            maxLength={10}
          />
          {errors.phonenumber && <Text style={styles.errorText}>{errors.phonenumber}</Text>}

          <Text style={styles.title}>Gender</Text>
          <View style={styles.radioContainer}>
            {renderRadioButton('Male')}
            {renderRadioButton('Female')}
            {renderRadioButton('Other')}
          </View>
          {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.title}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={formData.password}
          
              onChangeText={(text) => handleInputChange('password', text)}
              secureTextEntry={!showPassword}
              maxLength={50}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconContainer}>
              <Icon
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={24}
                color={'#000'}
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          <Text style={styles.title}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={formData.confirm_password}
            
              onChangeText={(text) => handleInputChange('confirm_password', text)}
              secureTextEntry={!showConfirmPassword}
              maxLength={50}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIconContainer}>
              <Icon
                name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                size={24}
                color={'#000'}
              />
            </TouchableOpacity>
          </View>
          {errors.confirm_password && <Text style={styles.errorText}>{errors.confirm_password}</Text>}
          <Text style={styles.title}>Referrel Code</Text>
          <TextInput
            style={styles.input}
            value={formData.ref_code}
            onChangeText={(text) => handleInputChange('ref_code', text)}
            maxLength={11}
          />
        </>
      )}

      <View style={styles.spacer} />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>Next</Text>
          <Icon name="arrow-forward" size={24} color="#000" style={styles.icon} />
        </View>
      </TouchableOpacity>
      {step > 1 &&
        <>
          <View style={styles.spacer} />
          <TouchableOpacity style={styles.backBbutton} onPress={handleBackStep}>
            <Text style={styles.backButton}>Back</Text>
          </TouchableOpacity>
        </>
      }

      {step === 1 &&
        <>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
            <Text style={styles.linkText}>
              <Text style={styles.linkBlackText}>Already have an Account? </Text>
              <Text style={styles.linkPrimaryText}>Log In</Text>
            </Text>
          </TouchableOpacity>

          <View style={styles.separatorContainer}>
            <View style={styles.separator} />
            <Text style={styles.separatorText}>OR</Text>
            <View style={styles.separator} />
          </View>

          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleRegister}>
            <View style={styles.googleButtonContent}>
              <Image source={googleIcon} style={styles.googleIcon} />
              <Text style={styles.googleButtonText}> Google Account</Text>
            </View>
          </TouchableOpacity>
        </>}

      {step === 3 && <Modal
        transparent={true}
        animationType="fade"
        visible={loading}
      >
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color={'#B94EA0'} />
        </View>
      </Modal>}
      </View>
    </ScrollView>
  </TouchableWithoutFeedback>
</KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 140,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    color: '#000',
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
  errorText: {
    color: 'red',
    marginBottom: 10,
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
    borderWidth: 4,
    borderColor: '#000',
    marginRight: 10,
  },
  selectedCircle: {
    backgroundColor: '#B94EA0',
  },
  radioText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'DMSans_500Medium',
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
    backgroundColor: '#000',
    marginHorizontal: 10,
  },
  separatorText: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'DMSans_700Bold',
    color:'#000',
  },
  googleButton: {
    width: '100%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#000',
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
    color: '#000',
    fontWeight: 'bold',
    fontFamily: 'DMSans_700Bold',
    fontSize: 18,
  },
  button: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderColor: '#fff',
    borderWidth: 1,
  },
  backBbutton: {
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
    borderColor: 'gray',
    borderWidth: 1,
  },
  buttonText: {
    color: '#B94EA0',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'DMSans_700Bold',
    
  },
  backButton: {
    color: 'gray',
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
    fontSize  : 15,
    fontFamily: 'DMSans_700Bold',
    fontWeight: 'bold',
  },
  linkPrimaryText: {
    color: '#B94EA0',
    fontWeight: 'bold',
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
  loaderOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  icon: {
    marginLeft: 10, // Space between the text and the image
    width: 20, // Adjust the width of the image (modify as needed)
    height: 20, // Adjust the height of the image (modify as needed)
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center', // Center the text and icon vertically
    justifyContent: 'center', // Center everything horizontally
    width:'100%',
  },
});

export default Register;
