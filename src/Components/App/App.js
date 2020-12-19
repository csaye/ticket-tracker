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
        { auth.currentUser ? <Homescreen /> : <SignIn /> }
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
      <p>Signed in as {auth.currentUser.displayName}</p>
      <img src={auth.currentUser.photoURL} alt="" />
      <button onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  );
}

// Homescreen
function Homescreen() {
  return (
    <>
      <TicketInput />
      <TicketList />
    </>
  );
}

// TicketInput
function TicketInput() {

  const ticketsRef = firestore.collection('tickets');

  const [priority, setPriority] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const sendTicket = async(e) => {
    e.preventDefault();
    const { uid, photoURL, displayName } = auth.currentUser;

    await ticketsRef.add({
      priority,
      title,
      description,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      displayName,
      uid,
      photoURL
    });

    setPriority('priority-low');
    setTitle('');
    setDescription('');
  }

  return (
    <div className="TicketInput">
      <form onSubmit={sendTicket}>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} required>
          <option value="priority-low">Low Priority</option>
          <option value="priority-medium">Medium Priority</option>
          <option value="priority-high">High Priority</option>
        </select>
        <input value={title} placeholder="Title" maxLength="128" onChange={(e) => setTitle(e.target.value)} required />
        <textarea value={description} placeholder="Description" maxLength="1024" onChange={(e) => setDescription(e.target.value)} rows="4" required />
        <button type="submit">Open Ticket</button>
      </form>
    </div>
  );
}

// TicketList
function TicketList() {

  const ticketsRef = firestore.collection('tickets');
  const query = ticketsRef.orderBy('createdAt').limit(25);

  const [tickets] = useCollectionData(query, {idField: 'id'});

  return (
    <div className="TicketList">
      {tickets && tickets.map(tkt => <Ticket key={tkt.id} message={tkt} />)}
    </div>
  );
}

// Ticket
function Ticket(props) {

  const { title, description, id, photoURL, displayName, createdAt, priority } = props.message;

  const resolveTicket = () => {
    firestore.collection('tickets').doc(id).delete();
  }

  const updatePriority = newPriority => {
    firestore.collection('tickets').doc(id).update({ priority: newPriority });
  }

  return (
    <div className={`Ticket ${priority}`}>
      <p>Created by {displayName}</p>
      {createdAt && <p>{createdAt.toDate().toDateString()} {createdAt.toDate().toLocaleTimeString()}</p>}
      <img src={photoURL} alt="" />
      <select value={priority} onChange={(e) => updatePriority(e.target.value)}>
        <option value="priority-low">Low Priority</option>
        <option value="priority-medium">Medium Priority</option>
        <option value="priority-high">High Priority</option>
      </select>
      <h1>{title}</h1>
      <p>{description}</p>
      <button onClick={resolveTicket}>Resolve</button>
    </div>
  );
}

export default App;
