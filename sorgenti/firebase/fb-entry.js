// Prodotti usati dalla PWA: account Google e sincronizzazione privata per account.
export { initializeApp, getApps } from 'firebase/app';
export { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
export { getFirestore, collection, doc, getDocFromServer, runTransaction, onSnapshot, serverTimestamp } from 'firebase/firestore';
export { getStorage, ref, getBlob, getMetadata, uploadBytes } from 'firebase/storage';
