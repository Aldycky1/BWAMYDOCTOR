import {
  equalTo,
  get,
  getDatabase,
  orderByChild,
  query,
  ref,
} from '@firebase/database';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Header, List} from '../../components';
import {Fire} from '../../config';
import {colors} from '../../utils';

const ChooseDoctor = ({navigation, route}) => {
  const itemCategory = route.params;
  const [listDoctor, setListDoctor] = useState([]);
  useEffect(() => {
    callDoctorByCategory(itemCategory.category);
  }, []);

  const callDoctorByCategory = category => {
    const db = getDatabase(Fire);

    const listDoctor = query(
      ref(db, 'doctors/'),
      orderByChild('category'),
      equalTo(category),
    );

    get(listDoctor)
      .then(value => {
        if (value.exists()) {
          const oldData = value.val();
          const data = [];
          Object.keys(oldData).map(item => {
            data.push({
              id: item,
              data: oldData[item],
            });
          });
          setListDoctor(data);
        }
      })
      .catch(error => {
        showError(error);
      });
  };
  return (
    <View style={styles.page}>
      <Header
        type="dark"
        title={`Pilih ${itemCategory.category}`}
        onPress={() => navigation.goBack()}
      />
      {listDoctor.map(doctor => {
        return (
          <List
            type="next"
            key={doctor.id}
            profile={{uri: doctor.data.photo}}
            name={doctor.data.fullName}
            desc={doctor.data.gender}
            onPress={() => navigation.navigate('Chatting')}
          />
        );
      })}
    </View>
  );
};

export default ChooseDoctor;

const styles = StyleSheet.create({
  page: {backgroundColor: colors.white, flex: 1},
});
