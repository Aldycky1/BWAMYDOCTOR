import {child, get, getDatabase, onValue, ref} from '@firebase/database';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {List} from '../../components';
import {Fire} from '../../config';
import {colors, fonts, getData} from '../../utils';

const Messages = ({navigation}) => {
  const [user, setUser] = useState({});
  const [historyChat, setHistoryChat] = useState([]);

  useEffect(() => {
    getDataUserFromLocal();
    const urlHistory = `messages/${user.uid}/`;
    const db = getDatabase(Fire);
    const getHistoryChat = ref(db, urlHistory);
    onValue(getHistoryChat, async snapshot => {
      if (snapshot.exists()) {
        const oldData = snapshot.val();
        const data = [];
        const promises = await Object.keys(oldData).map(async key => {
          const urlUidDoctor = `doctors/${oldData[key].uidPartner}`;
          const dbRef = ref(getDatabase(Fire));
          const detailDoctor = await get(child(dbRef, urlUidDoctor));
          data.push({
            id: key,
            detailDoctor: detailDoctor.val(),
            ...oldData[key],
          });
        });

        await Promise.all(promises);

        setHistoryChat(data);
      }
    });
  }, [user.uid]);

  const getDataUserFromLocal = () => {
    getData('user').then(res => {
      setUser(res);
    });
  };
  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <Text style={styles.title}>Messages</Text>
        {historyChat.map(chat => {
          const dataDoctor = {
            id: chat.detailDoctor.uid,
            data: chat.detailDoctor,
          };
          return (
            <List
              key={chat.id}
              profile={{uri: chat.detailDoctor.photo}}
              name={chat.detailDoctor.fullName}
              desc={chat.lastContentChat}
              onPress={() => navigation.navigate('Chatting', dataDoctor)}
            />
          );
        })}
      </View>
    </View>
  );
};

export default Messages;

const styles = StyleSheet.create({
  page: {backgroundColor: colors.secondary, flex: 1},
  content: {
    backgroundColor: colors.white,
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    marginTop: 30,
    marginLeft: 16,
  },
});
