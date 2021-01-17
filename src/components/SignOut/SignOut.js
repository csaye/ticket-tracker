import './SignOut.css';
import firebase from 'firebase/app';
import defaultProfile from '../../img/default_profile.png';

// SignOut component
function SignOut() {
  return (
    <div className="SignOut">
      <p>Signed in as {firebase.auth().currentUser.displayName}</p>
      <img src={firebase.auth().currentUser.photoURL ? firebase.auth().currentUser.photoURL : defaultProfile} alt="" />
      <button onClick={() => firebase.auth().signOut()}>Sign Out</button>
    </div>
  );
}

export default SignOut;
