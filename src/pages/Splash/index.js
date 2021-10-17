import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ILLogo} from '../../assets';
import {colors, fonts} from '../../utils';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {Fire} from '../../config';

const Splash = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      const auth = getAuth(Fire);
      onAuthStateChanged(auth, user => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          console.log('user: ', user);
          navigation.replace('MainApp');
        } else {
          // User is signed out
          navigation.replace('GetStarted');
        }
      });
    }, 3000);
  }, []);

  return (
    <View style={styles.page}>
      <ILLogo />
      <Text style={styles.title}>My Doctor</Text>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    marginTop: 20,
  },
});
