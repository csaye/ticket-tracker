import './Ticket.css';

import React, { useState } from 'react';

import firebase from 'firebase/app';
import { priorities } from '../../util/priorities.js';
import defaultProfile from '../../img/default_profile.png';

// Ticket component
function Ticket(props) {
  const { title, description, uid, id, photoURL, displayName, createdAt, priority } = props.message;

  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  function resolveTicket() {
    if (uid === firebase.auth().currentUser.uid) {
      firebase.firestore().collection('tickets').doc(id).delete();
    }
  }

  function startEditing() {
    // prime modal
    setNewTitle(title);
    setNewDescription(description);
    // open modal
    setEditing(true);
  }

  async function saveEdits(e) {
    e.preventDefault();
    await firebase.firestore().collection('tickets').doc(id).update({
      title: newTitle,
      description: newDescription
    });
    setEditing(false);
  }

  async function updatePriority(newPriority) {
    await firebase.firestore().collection('tickets').doc(id).update({
      priority: newPriority
    });
  }

  return (
    <div className={`Ticket ${priority}`}>
      <p>Created by {displayName}</p>
      {createdAt && <p>{createdAt.toDate().toDateString()} {createdAt.toDate().toLocaleTimeString()}</p>}
      <img src={photoURL ? photoURL : defaultProfile} alt="" />
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
      <button onClick={startEditing}>Edit</button>
      {
        editing &&
        <div className="EditModal">
          <div className="modal-content">
            <h1>Editing Ticket</h1>
            {/* Save edits form */}
            <form onSubmit={saveEdits}>
              <input
              value={newTitle}
              placeholder="Title"
              onChange={(e) => setNewTitle(e.target.value)}
              required
              />
              <textarea
              value={newDescription}
              placeholder="Description"
              onChange={(e) => setNewDescription(e.target.value)}
              rows="4"
              required
              />
              <div>
                <button type="button" onClick={() => setEditing(false)}>Discard changes</button>
                <button type="submit">Save changes</button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  );
}

export default Ticket;
