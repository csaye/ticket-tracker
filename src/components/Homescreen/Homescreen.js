import './Homescreen.css';

import React, { useState } from 'react';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'

import Ticket from '../Ticket/Ticket.js';

import { priorities } from '../../util/priorities.js';
import firebase from 'firebase/app';

const maxTickets = 128;

// Homescreen component
function Homescreen() {
  const [priority, setPriority] = useState(priorities[0][1]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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

  // get user document
  const uid = firebase.auth().currentUser.uid;
  const userRef = firebase.firestore().collection('users').doc(uid);
  const [userDoc] = useDocumentData(userRef);

  // const sTopic = userDoc ? userDoc.subtopic : '';

  // get user tickets from firestore collection
  const ticketsRef = firebase.firestore().collection('tickets');
  const query = ticketsRef
  .where('uid', '==', uid)
  .where('subtopic', '==', userDoc ? userDoc.subtopic : '')
  .orderBy('createdAt');
  const [tickets] = useCollectionData(query, {idField: 'id'});

  // filter tickets by priorities
  const filteredTickets = tickets
  ?.filter(tkt => (selectedPriorities.length === 0 || selectedPriorities.includes(tkt.priority)));

  // sends a ticket to firestore
  const sendTicket = async(e) => {
    e.preventDefault();
    const { uid, photoURL, displayName } = firebase.auth().currentUser;

    if (tickets.length < maxTickets) {
      await ticketsRef.add({
        priority,
        title,
        description,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        displayName,
        uid,
        photoURL,
        subtopic: userDoc.subtopic
      });
    } else {
      alert("Too many tickets.");
    }

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
            <input value={title} placeholder="Title" onChange={(e) => setTitle(e.target.value)} required />
            <textarea value={description} placeholder="Description" onChange={(e) => setDescription(e.target.value)} rows="4" required />
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
        {
          !filteredTickets ?
          <p>Retrieving tickets...</p>
          :
          <>
            {
              filteredTickets.length > 0 ?
              filteredTickets.map(tkt => <Ticket key={tkt.id} message={tkt} />) :
              <p>No tickets yet</p>
            }
          </>
        }
      </div>
    </div>
  );
}

export default Homescreen;
