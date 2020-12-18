import React, { useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore'

const config = {
  apiKey: "AIzaSyCw5-tDfXVripCiIehoWt8MdbopY7Ug-wk",
  authDomain: "csaye-team-tracker.firebaseapp.com",
  projectId: "csaye-team-tracker",
  storageBucket: "csaye-team-tracker.appspot.com",
  messagingSenderId: "268589792536",
  appId: "1:268589792536:web:4a4954b1a06580d4beb26d"
};
firebase.initializeApp(config);

const auth = firebase.auth();
const firestore = firebase.firestore();

// App
function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>Team Tracker</h1>
          { auth.currentUser && <SignOut /> }
      </header>
      <section>
        { auth.currentUser ? <TicketList /> : <SignIn /> }
      </section>
    </div>
  );
}

// SignIn
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <div className="SignIn">
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}

// SignOut
function SignOut() {
  return (
    <div className="SignOut">
      <p>Signed in as { auth.currentUser?.displayName } </p>
      <button onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  );
}

// TicketList
function TicketList() {

  const ticketsRef = firestore.collection('tickets');
  const query = ticketsRef.orderBy('createdAt').limit(25);

  const [tickets] = useCollectionData(query, {idField: 'id'});

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const sendTicket = async(e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;

    await ticketsRef.add({
      title,
      description,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setTitle('');
    setDescription('');
  }

  return (
    <div className="TicketList">
      <div>
        {tickets && tickets.map(tkt => <Ticket key={tkt.id} message={tkt} />)}
      </div>
      <form onSubmit={sendTicket}>
        <input value={title} placeholder="Title" onChange={(e) => setTitle(e.target.value)} required />
        <textarea value={description} placeholder="Description" onChange={(e) => setDescription(e.target.value)} rows="4" required />
        <button type="submit">Open Ticket</button>
      </form>
    </div>
  );
}

// Ticket
function Ticket(props) {
  const { title, description, uid, photoURL } = props.message;

  return (
    <div className="Ticket">
      <img src={photoURL} alt="" />
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

export default App;
