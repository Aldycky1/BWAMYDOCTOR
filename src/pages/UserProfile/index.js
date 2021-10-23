import {getAuth, signOut} from 'firebase/auth';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ILNullPhoto} from '../../assets';
import {Gap, Header, List, Profile} from '../../components';
import {Fire} from '../../config';
import {colors, getData, showError} from '../../utils';

const UserProfile = ({navigation}) => {
  const [profile, setProfile] = useState({
    fullName: '',
    profession: '',
    photoURL: ILNullPhoto,
  });
  useEffect(() => {
    getUser();
  }, []);

  const signOutApp = () => {
    const auth = getAuth(Fire);
    signOut(auth)
      .then(() => {
        navigation.replace('GetStarted');
      })
      .catch(error => {
        showError(error);
      });
  };

  const getUser = () => {
    getData('user').then(res => {
      const data = res;
      data.photoURL =
        res?.photoURL?.length > 1 ? {uri: res.photoURL} : ILNullPhoto;
      setProfile(data);
    });
  };
  return (
    <View style={styles.page}>
      <Header title="Profile" onPress={() => navigation.goBack()} />
      <Gap height={10} />
      {profile.fullName.length > 0 && (
        <Profile
          name={profile.fullName}
          desc={profile.profession}
          photoURL={profile.photoURL}
        />
      )}
      <Gap height={14} />
      <List
        name="Edit Profile"
        desc="Last Update Yesterday"
        type="next"
        icon="edit-profile"
        onPress={() => navigation.navigate('UpdateProfile')}
      />
      <List
        name="Language"
        desc="Last Update Yesterday"
        type="next"
        icon="language"
      />
      <List
        name="Gives Us Rate"
        desc="Last Update Yesterday"
        type="next"
        icon="rate"
      />
      <List
        name="Sign Out"
        desc="Last Update Yesterday"
        type="next"
        icon="help"
        onPress={signOutApp}
      />
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  page: {backgroundColor: colors.white, flex: 1},
});
