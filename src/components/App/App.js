import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { firebaseConfig } from '../../util/firebaseConfig.js';
import { useAuthState } from 'react-firebase-hooks/auth';

import Homescreen from '../Homescreen/Homescreen.js';
import SignIn from '../SignIn/SignIn.js';
import SignOut from '../SignOut/SignOut.js';

// initialize firebase
firebase.initializeApp(firebaseConfig);

// App component
function App() {
  useAuthState(firebase.auth());

  return (
    <div className="App">
      <header>
        <h1>Ticket Tracker</h1>
        { firebase.auth().currentUser && <SignOut /> }
      </header>
      <section>
        { firebase.auth().currentUser ? <Homescreen /> : <SignIn /> }
      </section>
    </div>
  );
}

export default App;
