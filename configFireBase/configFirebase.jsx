// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7tZ4QAv9cxhRkG4klxKD4L6pP2JuaEIw",
  authDomain: "ai-planner-7bc88.firebaseapp.com",
  projectId: "ai-planner-7bc88",
  storageBucket: "ai-planner-7bc88.appspot.com",
  messagingSenderId: "795798392710",
  appId: "1:795798392710:web:53e3194adce0e365bea607",
  measurementId: "G-YL7T5BCRNR",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
