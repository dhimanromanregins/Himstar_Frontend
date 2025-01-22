import React, { useState, useEffect } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';

const SplashScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('./../../assets/images/logo-without-shadow.png')}
        style={styles.logo}
      />
      {isLoading && (
        <ActivityIndicator size="large" color="gray" style={styles.loader} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderWidth: 2,
    // borderColor: '#121A26',
    // borderRadius: 25
  },
  loader: {
    marginTop: 150,
  },
});

export default SplashScreen;
