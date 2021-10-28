import {getDatabase, push, ref, set, onValue} from '@firebase/database';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {ChatItem, Header, InputChat} from '../../components';
import {Fire} from '../../config';
import {
  colors,
  fonts,
  getData,
  showError,
  getChatTime,
  setDateChat,
} from '../../utils';

const Chatting = ({navigation, route}) => {
  const dataDoctor = route.params;
  const [chatContent, setChatContent] = useState('');
  const [user, setUser] = useState({});
  const [chatData, setChatData] = useState([]);

  useEffect(() => {
    getDataUserFromLocal();
    const chatID = `${user.uid}_${dataDoctor.data.uid}`;
    const urlFirebase = `chatting/${chatID}/allChat/`;

    const db = getDatabase(Fire);
    const getChat = ref(db, urlFirebase);
    onValue(getChat, snapshot => {
      const dataSnapshot = snapshot.val();
      const allDataChat = [];
      Object.keys(dataSnapshot).map(key => {
        const dataChat = dataSnapshot[key];
        const newDataChat = [];

        Object.keys(dataChat).map(itemChat => {
          newDataChat.push({
            id: itemChat,
            data: dataChat[itemChat],
          });
        });

        allDataChat.push({
          id: key,
          data: newDataChat,
        });
      });
      console.log('all data chat: ', allDataChat);
      setChatData(allDataChat);
    });
  }, [dataDoctor.data.uid, user.uid]);

  const getDataUserFromLocal = () => {
    getData('user').then(res => {
      setUser(res);
    });
  };

  const chatSend = () => {
    console.log('user: ', user);
    const today = new Date();
    const data = {
      sendBy: user.uid,
      chatDate: today.getTime(),
      chatTime: getChatTime(today),
      chatContent: chatContent,
    };

    const chatID = `${user.uid}_${dataDoctor.data.uid}`;
    const urlFirebase = `chatting/${chatID}/allChat/${setDateChat(today)}`;

    const db = getDatabase(Fire);
    const allChatList = ref(db, urlFirebase);
    const newChat = push(allChatList);
    set(newChat, data)
      .then(() => {
        setChatContent('');
      })
      .catch(error => {
        showError(error);
      });
  };

  return (
    <View style={styles.page}>
      <Header
        type="dark-profile"
        title={dataDoctor.data.fullName}
        desc={dataDoctor.data.profession}
        photo={{uri: dataDoctor.data.photo}}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {chatData.map(chat => {
            return (
              <View key={chat.id}>
                <Text style={styles.chatDate}>{chat.id}</Text>
                {chat.data.map(itemChat => {
                  return (
                    <ChatItem
                      key={itemChat.id}
                      isMe={itemChat.data.sendBy === user.uid}
                      text={itemChat.data.chatContent}
                      date={itemChat.data.chatTime}
                    />
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      </View>
      <InputChat
        value={chatContent}
        onChangeText={value => setChatContent(value)}
        onButtonPress={chatSend}
      />
    </View>
  );
};

export default Chatting;

const styles = StyleSheet.create({
  page: {backgroundColor: colors.white, flex: 1},
  content: {flex: 1},
  chatDate: {
    fontSize: 11,
    fontFamily: fonts.primary.normal,
    color: colors.text.secondary,
    marginVertical: 20,
    textAlign: 'center',
  },
});
