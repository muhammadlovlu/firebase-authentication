// import logo from './logo.svg';
import { useState } from 'react';
import './App.css';


import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";

import firebaseConfig from './firebase.config';
firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: ''
  });
  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
  }



  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: '',
          error: '',
          success: false
        }
        setUser(signedOutUser);
      })
      .catch(err => {
        console.log(err);
      })
  }


const handleSubmit = (e) => {
 
if(user.email && user.password){
  firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then((userCredential) => {
    // Signed in 
    // var user = userCredential.user;
    const newUserInfo = {...user};
    newUserInfo.error = '';
    newUserInfo.success = true;
    setUser(newUserInfo);
    

    // ...
  })
  .catch((error) => {
    const newUserInfo = {...user};
    
    newUserInfo.success = false;
    newUserInfo.error = error.message;
   setUser(newUserInfo);
    // ..
  });
}
e.preventDefault();
}

const handleBlur = (e) => {

 let isFieldValid = true;
 if(e.target.name === "email"){
 
 isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
  console.log(isFieldValid);

 }
 
 if (e.target.name === "password"){
   
  const isPasswordValid = e.target.value.length > 6;
  const passwordHasNumber = /\d{1}/.test(e.target.value);
  isFieldValid = isPasswordValid && passwordHasNumber;
 }

 if(isFieldValid){

  const newUserInfo = {...user};
  newUserInfo[e.target.name] = e.target.value;
  setUser(newUserInfo);

 }


}


  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> : <button onClick={handleSignIn}>Sign In</button>

      }

      {
        user.isSignedIn &&
        <div>
          <p>Welcome, {user.name}</p>
          <p> {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }

<h1>Our Own Authentication</h1>

<form onSubmit={handleSubmit}>
  <input type="checkbox" value="" />New User
  <br />
  <input type="text" name="name"  onBlur={handleBlur} placeholder="Your Name" required/>
  <br />
  <input type="name" name="email" onBlur={handleBlur} placeholder="Your Email Address" required/>
  <br />
  <input type="password" name="password" onBlur={handleBlur} placeholder="Your Password" required/>
  <br />
      <input type="submit" value="Submit" />
</form>
<p style={{color:'red'}}>{user.error}</p>
{user.success && <p style={{color:'green'}}>User Created Successfully</p>}
    </div>
  );
}

export default App;
