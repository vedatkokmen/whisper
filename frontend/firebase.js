import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBPLEujWMVJOpZWLjaXevP9wv_xibjHMN8",
  authDomain: "chat-16654.firebaseapp.com",
  databaseURL: "https://chat-16654.firebaseio.com",
  projectId: "chat-16654",
  storageBucket: "chat-16654.appspot.com",
  messagingSenderId: "217333992882",
  appId: "1:217333992882:web:5ae4047a83c8ee3f2868ab",
  measurementId: "G-L3HD4WZ6W1",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const chatsRef = collection(db, "chats");
console.log(chatsRef);
// Get a list of cities from your database
export async function getChats(db) {
  const chatsCol = collection(db, "chats");
  const chatsSnapshot = await getDocs(chatsCol);
  const chatList = chatsSnapshot.docs.map((doc) => doc.data());
  return chatList;
}

async function main() {
  const chats = await getChats(db);
  console.log(chats);
}

main();

export default db;
