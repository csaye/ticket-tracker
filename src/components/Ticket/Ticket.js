import './Ticket.css';

import firebase from 'firebase/app';
import { priorities } from '../../util/priorities.js';
import defaultProfile from '../../img/default_profile.png';

// Ticket component
function Ticket(props) {
  const { title, description, uid, id, photoURL, displayName, createdAt, priority } = props.message;

  const resolveTicket = () => {
    if (uid === firebase.auth().currentUser.uid) {
      firebase.firestore().collection('tickets').doc(id).delete();
    }
  }

  const updatePriority = newPriority => {
    if (uid === firebase.auth().currentUser.uid) {
      firebase.firestore()
      .collection('tickets')
      .doc(id)
      .update({
        priority: newPriority
      });
    }
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
    </div>
  );
}

export default Ticket;
