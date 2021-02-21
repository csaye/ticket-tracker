import './SignOut.css';

import firebase from 'firebase/app';
import defaultProfile from '../../img/default_profile.png';

import React, { useEffect } from 'react';

// SignOut component
function SignOut() {

  async function initializeUser() {
    const uid = firebase.auth().currentUser.uid;
    const docRef = firebase.firestore().collection('users').doc(uid);
    const doc = await docRef.get();
    // if no doc for user exists, initialize user
    if (!doc.exists) {
      await firebase.firestore().collection('users').doc(uid).set({
        uid: uid,
        subtopic: 'default'
      });
      await firebase.firestore().collection('subtopics').add({
        uid: uid,
        name: 'default'
      })
    }
  }

  useEffect(() => {
    // initialize user on start
    initializeUser();
  }, []);

  return (
    <div className="SignOut">
      <p>Signed in as {firebase.auth().currentUser.displayName}</p>
      <img src={firebase.auth().currentUser.photoURL ? firebase.auth().currentUser.photoURL : defaultProfile} alt="" />
      <button onClick={() => firebase.auth().signOut()}>Sign Out</button>
    </div>
  );
}

export default SignOut;
