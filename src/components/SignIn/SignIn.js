import './SignIn.css';
import firebase from 'firebase/app';

// SignIn component
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }

  return (
    <div className="SignIn">
      <div className="container">
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      </div>
    </div>
  );
}

export default SignIn;
