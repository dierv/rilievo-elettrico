// Solo i prodotti usati dalla PWA: Firestore e Storage verranno aggiunti con la sincronizzazione.
export { initializeApp, getApps } from 'firebase/app';
export { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
