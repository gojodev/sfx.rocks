// ? https://firebase.google.com/docs/projects/learn-more#:~:text=The%20content%20of%20the%20Firebase,and%20Cloud%20Storage%20bucket%20name. 
/**
 * there is no harm in showing my API key and other creditionals
 * because there are security rules that stop others from malicously using them
 */

import { initializeApp } from "firebase"; 

const firebaseConfig = {
  apiKey: "AIzaSyA77HYtVdsJD_SdwDgdVWvGDeDA1IIquKY",
  authDomain: "sfx-rocks.firebaseapp.com",
  projectId: "sfx-rocks",
  storageBucket: "sfx-rocks.appspot.com",
  messagingSenderId: "221320269920",
  appId: "1:221320269920:web:0804ed9dfe08c466677305",
  measurementId: "G-V506HKS3NE"
};

export function config() {
  initializeApp(firebaseConfig);
}

// ! update your firebase rules