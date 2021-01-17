import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { firebaseConfig } from '../../util/firebaseConfig.js';
import defaultProfile from '../../img/default_profile.png';
import { useAuthState } from 'react-firebase-hooks/auth';

import Homescreen from '../Homescreen/Homescreen.js';

// initialize firebase
firebase.initializeApp(firebaseConfig);

// App
function App() {
  const [user] = useAuthState(firebase.auth());

  return (
    <div className="App">
      <header>
        <h1>Ticket Tracker</h1>
        { firebase.auth().currentUser && <SignOut /> }
      </header>
      <section>
        { user ? <Homescreen /> : <SignIn /> }
      </section>
    </div>
  );
}

// SignIn
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }

  return (
    <div className="SignIn">
      <div className="container">
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      </div>
    </div>
  );
}

// SignOut
function SignOut() {
  return (
    <div className="SignOut">
      <p>Signed in as {firebase.auth().currentUser.displayName}</p>
      <img src={firebase.auth().currentUser.photoURL ? firebase.auth().currentUser.photoURL : defaultProfile} alt="" />
      <button onClick={() => firebase.auth().signOut()}>Sign Out</button>
    </div>
  );
}

export default App;
