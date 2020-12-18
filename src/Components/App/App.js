import React from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';

firebase.initializeApp({
  apiKey: "AIzaSyCw5-tDfXVripCiIehoWt8MdbopY7Ug-wk",
  authDomain: "csaye-team-tracker.firebaseapp.com",
  projectId: "csaye-team-tracker",
  storageBucket: "csaye-team-tracker.appspot.com",
  messagingSenderId: "268589792536",
  appId: "1:268589792536:web:4a4954b1a06580d4beb26d"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div>
      <header>
        <h1>Team Tracker</h1>
      </header>
    </div>
  );
}

export default App;
