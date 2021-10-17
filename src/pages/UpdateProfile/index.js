import {getDatabase, ref, update} from '@firebase/database';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Button, Header, Input, Profile, Gap} from '../../components';
import {Fire} from '../../config';
import {colors, getData, storeData} from '../../utils';
import {launchImageLibrary} from 'react-native-image-picker';
import {ILNullPhoto} from '../../assets';
import {showMessage} from 'react-native-flash-message';
import {
  EmailAuthProvider,
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
} from 'firebase/auth';

const UpdateProfile = ({navigation}) => {
  const [profile, setProfile] = useState({
    fullName: '',
    profession: '',
    email: '',
  });
  const [password, setPassword] = useState('');
  const [photoURL, setPhotoURL] = useState(ILNullPhoto);
  const [photoForDB, setPhotoForDB] = useState('');

  useEffect(() => {
    getData('user').then(res => {
      const data = res;
      setPhotoURL({uri: res.photoURL});
      setProfile(data);
    });
  }, []);

  const updateProfile = () => {
    console.log('profile: ', profile);
    console.log('new Password: ', password);

    if (password.length > 0) {
      if (password.length < 6) {
        showMessage({
          message: 'Oops, password kurang dari 6 karakter',
          type: 'default',
          backgroundColor: colors.error,
          color: 'white',
        });
      } else {
        updatePasswordOnly();
        updateProfileData();
        navigation.replace('MainApp');
      }
    } else {
      updateProfileData();
      navigation.replace('MainApp');
    }
  };

  const updatePasswordOnly = () => {
    const auth = getAuth(Fire);
    const {currentUser} = auth;
    const {email} = currentUser;
    const credential = EmailAuthProvider.credential(email, password);

    reauthenticateWithCredential(currentUser, credential)
      .then(() => {
        onAuthStateChanged(auth, user => {
          if (user) {
            updatePassword(user, password).catch(error => {
              showMessage({
                message: error,
                type: 'default',
                backgroundColor: colors.error,
                color: 'white',
              });
            });
          }
        });
      })
      .catch(error => {
        console.log('error reauthenticated: ', error);
      });
  };

  const updateProfileData = () => {
    const db = getDatabase(Fire);

    const data = profile;
    data.photoURL = photoForDB;
    const updates = {};
    updates[`/users/${data.uid}/`] = data;
    update(ref(db), updates);

    console.log('success: ', data);
    storeData('user', data);
  };

  const changeText = (key, value) => {
    setProfile({
      ...profile,
      [key]: value,
    });
  };

  const getImage = () => {
    launchImageLibrary(
      {quality: 0.5, maxWidth: 200, maxHeight: 200, includeBase64: true},
      response => {
        console.log('response: ', response);
        if (response.didCancel || response.errorMessage) {
          showMessage({
            message: 'oops, sepertinya anda belum memilih foto',
            type: 'default',
            backgroundColor: colors.error,
            color: colors.white,
          });
        } else {
          console.log('response getImage: ', response);
          const source = {uri: response.uri};

          setPhotoForDB(`data:${response.type};base64, ${response.base64}`);
          setPhotoURL(source);
        }
      },
    );
  };
  return (
    <View style={styles.page}>
      <Header title="Edit Profile" onPress={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Profile isRemove photoURL={photoURL} onPress={getImage} />
          <Gap height={26} />
          <Input
            label="Full Name"
            value={profile.fullName}
            onChangeText={value => changeText('fullName', value)}
          />
          <Gap height={24} />
          <Input
            label="Pekerjaan"
            value={profile.profession}
            onChangeText={value => changeText('profession', value)}
          />
          <Gap height={24} />
          <Input label="Email" value={profile.email} disable />
          <Gap height={24} />
          <Input
            label="Password"
            value={password}
            onChangeText={value => setPassword(value)}
            secureTextEntry
          />
          <Gap height={24} />
          <Button title="Save Profile" onPress={updateProfile} />
        </View>
      </ScrollView>
    </View>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  page: {backgroundColor: colors.white, flex: 1},
  content: {padding: 40, paddingTop: 0},
});
