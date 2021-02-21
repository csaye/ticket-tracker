import './Subtopics.css';

import React, { useState } from 'react';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'

import firebase from 'firebase/app';

function Subtopics() {
  const [deleting, setDeleting] = useState(false);
  const [subtopicName, setSubtopicName] = useState('');

  // get user subtopics from firestore collection
  const uid = firebase.auth().currentUser.uid;
  const subtopicsRef = firebase.firestore().collection('subtopics');
  const query = subtopicsRef
  .where('uid', '==', uid)
  .orderBy('name');
  const [subtopics] = useCollectionData(query, {idField: 'id'});

  const userRef = firebase.firestore().collection('users').doc(uid);
  const [userDoc] = useDocumentData(userRef);

  // selects subtopic by name
  function selectSubtopic(name) {
    firebase.firestore().collection('users').doc(uid).update({
      subtopic: name
    });
  }

  // deletes subtopic by name
  async function deleteSubtopic(name) {
    setDeleting(false);
    // delete all subtopics with name from user
    firebase.firestore().collection('subtopics')
    .where('uid', '==', uid).where('name', '==', name).get()
    .then((snapshot) => {
      // create batch
      const batch = firebase.firestore().batch();
      // batch all deletions
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      // commit batch
      batch.commit();
    })
    // delete all tickets with subtopic
    firebase.firestore().collection('tickets')
    .where('uid', '==', uid).where('subtopic', '==', name).get()
    .then((snapshot) => {
      // create batch
      const batch = firebase.firestore().batch();
      // batch all deletions
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      // commit batch
      batch.commit();
    })
    // set current subtopic to default
    await firebase.firestore().collection('users').doc(uid).update({
      subtopic: 'default'
    });
  }

  async function newSubtopic(e) {
    e.preventDefault();
    const sName = subtopicName;
    setSubtopicName('');
    // return if subtopic already exists
    const snapshot = await subtopicsRef.where('uid', '==', uid).get();
    const subtopics = snapshot.docs.map(d => d.data());
    if (subtopics.some(s => s.name === sName)) return;
    // add subtopic
    await subtopicsRef.add({
      name: sName,
      uid: uid
    });
  }

  if (!subtopics) {
    return (
      <div className="Subtopics">
        <p>Retrieving subtopics...</p>
      </div>
    )
  }

  return (
    <div className="Subtopics">
      {
        subtopics.map(s =>
          <div className="subtopic" key={s.id}>
            <button onClick={() => selectSubtopic(s.name)}>{s.name}</button>
          </div>
        )
      }
      <form onSubmit={newSubtopic}>
        <input
        value={subtopicName}
        type="text"
        onChange={e => setSubtopicName(e.target.value)}
        required
        />
        <button type="submit" className="symbol-button">
          <p>+</p>
        </button>
      </form>
      <p className="subtopic-title">{userDoc ? userDoc.subtopic : '...'}</p>
      {
        (userDoc && userDoc.subtopic !== 'default') &&
        <button onClick={() => setDeleting(true)} className="symbol-button">
          <p>-</p>
        </button>
      }
      {
        deleting &&
        <div className="modal">
          <div className="modal-content">
            <h1>Delete "{userDoc?.subtopic}"?</h1>
            <p>This action is irreversible.</p>
            <button onClick={() => setDeleting(false)}>Cancel</button>
            <button onClick={() => deleteSubtopic(userDoc?.subtopic)}>Delete</button>
          </div>
        </div>
      }
    </div>
  )
}

export default Subtopics;
