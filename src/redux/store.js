import {createStore} from 'redux';

const initialState = {
  loading: false,
};

const reducer = (state = initialState, action) => {
  return state;
};

const store = createStore(reducer);

export default store;