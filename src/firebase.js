import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyDDRqpBuurFup_wLl98PZJYOmY7A4idjwc",
  authDomain: "react-chat-a3194.firebaseapp.com",
  databaseURL: "https://react-chat-a3194.firebaseio.com",
  projectId: "react-chat-a3194",
  storageBucket: "react-chat-a3194.appspot.com",
  messagingSenderId: "82676227208",
  appId: "1:82676227208:web:b94f4893cf86196194133d",
  measurementId: "G-C107BFTHXP"
};

firebase.initializeApp(config);

const database = firebase.database();

export {
  database,
};