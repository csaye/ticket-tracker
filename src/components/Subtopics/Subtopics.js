import './Subtopics.css';

import React, { useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore'

import firebase from 'firebase/app';

function Subtopics() {
  const [subtopicName, setSubtopicName] = useState('');

  // get user subtopics from firestore collection
  const uid = firebase.auth().currentUser.uid;
  const subtopicsRef = firebase.firestore().collection('subtopics');
  const query = subtopicsRef
  .where('uid', '==', uid)
  .orderBy('name');
  const [subtopics] = useCollectionData(query, {idField: 'id'});

  // selects subtopic by name
  function selectSubtopic(name) {

  }

  async function newSubtopic(e) {
    e.preventDefault();
    await subtopicsRef.add({
      name: subtopicName,
      uid: uid
    });
    setSubtopicName('');
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
        <button type="submit">+</button>
      </form>
    </div>
  )
}

export default Subtopics;
