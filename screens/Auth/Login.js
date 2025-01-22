import React, { useState, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Animated, Modal, ActivityIndicator, BackHandler, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import googleIcon from '../../assets/images/google-img.png';
import { useFocusEffect } from '@react-navigation/native';
import { userLogin, userGoogleRegistration } from '../../actions/ApiActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


const Login = ({ navigation }) => {
  const [backPressedOnce, setBackPressedOnce] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (backPressedOnce) {
          BackHandler.exitApp();
          return true;
        }
        setBackPressedOnce(true);
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);

        setTimeout(() => setBackPressedOnce(false), 2000);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      return () => backHandler.remove();
    }, [backPressedOnce])
  );

  useFocusEffect(
    useCallback(() => {
      return () => {
        setUsername('');
        setPassword('');
        setShowPassword(false);
        setErrors({});
        setLoading(false);
      };
    }, [])
  );

  const validateStep = () => {
    const newErrors = {};
    if (!username) {
      newErrors.username = 'Username is required.';
    }
    if (!password){
      newErrors.password = 'Password is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async() => {
    if (!validateStep()) {
      return;
    }
    setLoading(true);
    const result = await userLogin({username_or_email: username, password: password});
    let errorMsg;
    if (result[0] === 200) {
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
    };
    setLoading(false);
  };

  const handleGoogleSignIn = async() => {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo?.type === 'cancelled'){
        return;
      }
      const userData = {
        data: userInfo?.data?.user,
        token: userInfo?.data?.idToken,
      }
      console.log('User Data:', userData);
      setLoading(true);
      const result = await userGoogleRegistration({token: userInfo?.data?.idToken});
      console.log('Result:', result);
      let errorMsg;
      if (result[0] === 200 || result[0] === 201) {
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
        console.log('Error:', errorMsg);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Email</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={(text)=>{ setErrors({ ...errors, ['username']: '' }); setUsername(text)}}
        maxLength={150}
      />
      {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

      <Text style={styles.title}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          value={password}
          
          onChangeText={(text)=>{ setErrors({ ...errors, ['password']: '' }); setPassword(text)}}
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

      <View style={styles.spacer} />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Get started</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>
          <Text style={styles.linkBlackText}>Don't have an Account? </Text>
          <Text style={styles.linkPrimaryText}>Create Account</Text>
        </Text>
      </TouchableOpacity>

      <View style={styles.separatorContainer}>
        <View style={styles.separator} />
        <Text style={styles.separatorText}>OR</Text>
        <View style={styles.separator} />
      </View>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <View style={styles.googleButtonContent}>
          <Image source={googleIcon} style={styles.googleIcon} />
          <Text style={styles.googleButtonText}> Google Account</Text>
        </View>
      </TouchableOpacity>

      <Modal transparent={true} animationType="fade" visible={loading}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color='#B94EA0' />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 140,
    backgroundColor: '#FFFFFF',
  },
  
  loginText: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
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
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
    top: 12,
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
    backgroundColor: '#B94EA0',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 15,
  },
  buttonText: {
    color: '#FFFFFF',
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
    fontSize  : 15,
    fontFamily: 'DMSans_700Bold',
    fontWeight: 'bold',
  },  
  linkPrimaryText: {
    color: '#B94EA0',
    fontSize  : 15,
    fontFamily: 'DMSans_700Bold',
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default Login;
