import {initializeApp} from 'firebase/app';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDhDDWnAPcbOk1nzKBR6YdF9VgkdC7A1Ig',
  authDomain: 'my-doctor-ea249.firebaseapp.com',
  projectId: 'my-doctor-ea249',
  storageBucket: 'my-doctor-ea249.appspot.com',
  messagingSenderId: '712836017383',
  appId: '1:712836017383:web:5076736ba8d9496ccf8642',
};

// Initialize Firebase
const Fire = initializeApp(firebaseConfig);

export default Fire;
