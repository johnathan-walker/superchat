import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useState } from 'react';

firebase.initializeApp({
  apiKey: "AIzaSyB5V09GGSLZDqjcowX0BUbUILI9-4R-Vzg",
  authDomain: "superchat-8e98e.firebaseapp.com",
  projectId: "superchat-8e98e",
  storageBucket: "superchat-8e98e.appspot.com",
  messagingSenderId: "666216654409",
  appId: "1:666216654409:web:1f3a1b6914cdea937cc198",
  measurementId: "G-8LCQH4QBQL"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
  const [user] = useAuthState();

  return (
    <div className="App">
      <header>

      </header>

      <section>
        {user ? <ChatRoom/> : <SignIn/> }
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={()=> auth.SignOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL} = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
  }

  return (
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      </div>

      <form>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
        <button type="submit">Send Message</button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const {text, uid} = props.message;
  return (
    <p>{text}</p>
  )
}

export default App;
