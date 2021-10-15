import {getAuth, signInWithEmailAndPassword} from '@firebase/auth';
import {child, get, getDatabase, ref} from '@firebase/database';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {ILLogo} from '../../assets';
import {Button, Gap, Input, Link, Loading} from '../../components';
import {Fire} from '../../config';
import {colors, fonts, storeData, useForm} from '../../utils';

const Login = ({navigation}) => {
  const [form, setForm] = useForm({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const login = () => {
    console.log('form: ', form);
    setLoading(true);
    const auth = getAuth(Fire);
    signInWithEmailAndPassword(auth, form.email, form.password)
      .then(userCredential => {
        const user = userCredential.user;
        console.log('success: ', user);
        setLoading(false);
        const dbRef = ref(getDatabase(Fire));
        get(child(dbRef, `users/${user.uid}/`))
          .then(snapshot => {
            if (snapshot.exists()) {
              console.log('user', snapshot.val());
              storeData('user', snapshot.val());
              navigation.replace('MainApp');
            } else {
              console.log('No data available');
            }
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        const errorMessage = error.message;
        console.log('error: ', error);
        setLoading(false);
        showMessage({
          message: errorMessage,
          type: 'default',
          backgroundColor: colors.error,
          color: colors.white,
        });
      });
  };
  return (
    <>
      <View style={styles.page}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Gap height={40} />
          <ILLogo />
          <Text style={styles.title}>Masuk dan mulai berkonsultasi</Text>
          <Input
            label="Email Address"
            value={form.email}
            onChangeText={value => setForm('email', value)}
          />
          <Gap height={24} />
          <Input
            label="Password"
            value={form.password}
            onChangeText={value => setForm('password', value)}
            secureTextEntry
          />
          <Gap height={10} size={12} />
          <Link title="Forgot My Password" />
          <Gap height={40} />
          <Button title="Sign In" onPress={login} />
          <Gap height={30} />
          <Link
            title="Create New Account"
            size={16}
            align="center"
            onPress={() => navigation.navigate('Register')}
          />
        </ScrollView>
      </View>
      {loading && <Loading />}
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  page: {paddingHorizontal: 40, backgroundColor: colors.white, flex: 1},
  title: {
    fontSize: 20,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    marginTop: 40,
    marginBottom: 40,
    maxWidth: 153,
  },
});
