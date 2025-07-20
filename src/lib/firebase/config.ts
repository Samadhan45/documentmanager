import {initializeApp, getApps} from 'firebase/app';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBT2nM-NmZKRjvyo8Ln3tksCQd_guDvulA',
  authDomain: 'certvault-ai.firebaseapp.com',
  projectId: 'certvault-ai',
  storageBucket: 'certvault-ai.appspot.com',
  messagingSenderId: '857692423877',
  appId: '1:857692423877:web:b35056e965c264de4fd2ac',
};

let firebaseApp;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

export {firebaseApp};
