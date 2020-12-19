import React, { useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import prioritiesJson from '../../data/PriorityData.json';

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

const priorities = prioritiesJson.priorities.map(p => [
  p.name,
  p.className
]);

// App
function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>Ticket Tracker</h1>
          { auth.currentUser && <SignOut /> }
      </header>
      <section className="HomeSection">
        { user ? <Homescreen /> : <SignIn /> }
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

  // start selected priorities
  let [selectedPriorities, setSelectedPriorities] = useState([]);

  function updatePriorities(e) {
    let checked = e.target.checked;
    let p = e.target.getAttribute('priority');
    checked ? addPriority(p) : removePriority(p);
  }

  function addPriority(p) {
    const pIndex = selectedPriorities.indexOf(p);
    if (pIndex !== -1) { return; }
    let newPs = selectedPriorities.slice();
    newPs.push(p);
    setSelectedPriorities(newPs);
  }

  function removePriority(p) {
    const pIndex = selectedPriorities.indexOf(p);
    if (pIndex === -1) { return; }
    let newPs = selectedPriorities.slice();
    newPs.splice(pIndex, 1);
    setSelectedPriorities(newPs);
  }
  // end selected priorities

  const ticketsRef = firestore.collection('tickets');
  const query = ticketsRef.orderBy('createdAt').limit(25);
  const [tickets] = useCollectionData(query, {idField: 'id'});

  const [priority, setPriority] = useState(priorities[0][1]);
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

    setPriority(priorities[0][1]);
    setTitle('');
    setDescription('');
  }

  return (
    <div className="Homescreen">
      <div className="TicketInput">
        <div className="container">
          <form onSubmit={sendTicket}>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} required>
              {
                priorities.map(p => (
                  <option key={p[1]} value={p[1]}>{p[0]}</option>
                ))
              }
            </select>
            <input value={title} placeholder="Title" maxLength="128" onChange={(e) => setTitle(e.target.value)} required />
            <textarea value={description} placeholder="Description" maxLength="1024" onChange={(e) => setDescription(e.target.value)} rows="4" required />
            <button type="submit">Open Ticket</button>
          </form>
          <div className="checkboxes">
            <p><u>Showing{selectedPriorities.length > 0 ? ':' : ' All'}</u></p>
            {
              priorities.map(p => (
                <div key={`div-${p[1]}`}>
                  <label key={`label-${p[1]}`} htmlFor={`checkbox-${p[1]}`}>{p[0]}</label>
                  <input key={`checkbox-${p[1]}`} type="checkbox" id={`checkbox-${p[1]}`} priority={p[1]} onChange={updatePriorities}></input>
                </div>
              ))
            }
          </div>
        </div>
      </div>
      <div className="TicketList">
        {tickets && tickets.filter(tkt => (selectedPriorities.length === 0 || selectedPriorities.includes(tkt.priority))).map(tkt => <Ticket key={tkt.id} message={tkt} />)}
      </div>
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
        {
          priorities.map(p => (
            <option key={p[1]} value={p[1]}>{p[0]}</option>
          ))
        }
      </select>
      <h1>{title}</h1>
      <p>{description}</p>
      <button onClick={resolveTicket}>Resolve</button>
    </div>
  );
}

export default App;
