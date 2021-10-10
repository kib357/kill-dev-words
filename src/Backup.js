import { initializeApp } from "firebase/app";
import { doc, setDoc, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkSjB5frL3RsFb7PnyjbGmQDBbpa_phiQ",
  authDomain: "kill-dev-words.firebaseapp.com",
  projectId: "kill-dev-words",
  storageBucket: "kill-dev-words.appspot.com",
  messagingSenderId: "173670692157",
  appId: "1:173670692157:web:e995ac1b7177c5a3328154",
};

const firebaseApp = initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
});

const db = getFirestore();

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

function Backup(data) {
  //   app
  setDoc(
    doc(db, "results", Date.now() + "-" + String(Math.random().toFixed(6))),
    { ...data, stand: localStorage.getItem("stand") || "none" }
  );
}

export default Backup;
