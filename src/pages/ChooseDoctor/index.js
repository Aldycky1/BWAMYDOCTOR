import React from 'react';
import {StyleSheet, View} from 'react-native';
import {DummyDoctor4} from '../../assets';
import {Header, List} from '../../components';
import {colors} from '../../utils';

const ChooseDoctor = ({navigation}) => {
  return (
    <View style={styles.page}>
      <Header
        type="dark"
        title="Pilih Dokter Anak"
        onPress={() => navigation.goBack()}
      />
      <List
        type="next"
        profile={DummyDoctor4}
        name="Alexander Jennie"
        desc="Wanita"
        onPress={() => navigation.navigate('Chatting')}
      />
      <List
        type="next"
        profile={DummyDoctor4}
        name="Alexander Jennie"
        desc="Wanita"
      />
      <List
        type="next"
        profile={DummyDoctor4}
        name="Alexander Jennie"
        desc="Wanita"
      />
      <List
        type="next"
        profile={DummyDoctor4}
        name="Alexander Jennie"
        desc="Wanita"
      />
      <List
        type="next"
        profile={DummyDoctor4}
        name="Alexander Jennie"
        desc="Wanita"
      />
    </View>
  );
};

export default ChooseDoctor;

const styles = StyleSheet.create({
  page: {backgroundColor: colors.white, flex: 1},
});
