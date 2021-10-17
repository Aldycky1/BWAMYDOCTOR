import {NavigationContainer} from '@react-navigation/native';
import React, {useState} from 'react';
import FlashMessage from 'react-native-flash-message';
import {Provider} from 'react-redux';
import {Loading} from './components';
import store from './redux/store';
import Router from './router';

const App = () => {
  const [loading, setLoading] = useState(false);
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
      <FlashMessage position="top" />
      {loading && <Loading />}
    </Provider>
  );
};

export default App;
