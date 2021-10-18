import {getAuth, signInWithEmailAndPassword} from '@firebase/auth';
import {child, get, getDatabase, ref} from '@firebase/database';
import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {ILLogo} from '../../assets';
import {Button, Gap, Input, Link} from '../../components';
import {Fire} from '../../config';
import {colors, fonts, showError, storeData, useForm} from '../../utils';

const Login = ({navigation}) => {
  const [form, setForm] = useForm({
    email: '',
    password: '',
  });
  const dispatch = useDispatch();

  const login = () => {
    dispatch({type: 'SET_LOADING', value: true});
    const auth = getAuth(Fire);
    signInWithEmailAndPassword(auth, form.email, form.password)
      .then(userCredential => {
        const user = userCredential.user;
        dispatch({type: 'SET_LOADING', value: false});
        const dbRef = ref(getDatabase(Fire));
        get(child(dbRef, `users/${user.uid}/`)).then(snapshot => {
          if (snapshot.exists()) {
            storeData('user', snapshot.val());
            navigation.replace('MainApp');
          }
        });
      })
      .catch(error => {
        const errorMessage = error.message;
        dispatch({type: 'SET_LOADING', value: false});
        showError(errorMessage);
      });
  };
  return (
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
