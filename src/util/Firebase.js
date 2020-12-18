import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyCw5-tDfXVripCiIehoWt8MdbopY7Ug-wk",
  authDomain: "csaye-team-tracker.firebaseapp.com",
  projectId: "csaye-team-tracker",
  storageBucket: "csaye-team-tracker.appspot.com",
  messagingSenderId: "268589792536",
  appId: "1:268589792536:web:4a4954b1a06580d4beb26d"
};
firebase.initializeApp(config);

export default firebase;
