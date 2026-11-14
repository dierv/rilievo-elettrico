// Prodotti usati dalla PWA e dall'app nativa: account Apple/Google (collegabili) e sincronizzazione privata per account.
export { initializeApp, getApps } from 'firebase/app';
export {
  getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, signInWithCredential, onAuthStateChanged, signOut,
  linkWithPopup, linkWithCredential, unlink, reauthenticateWithPopup, deleteUser, revokeAccessToken
} from 'firebase/auth';
export { getFirestore, collection, doc, getDocFromServer, runTransaction, onSnapshot, serverTimestamp } from 'firebase/firestore';
export { getStorage, ref, getBlob, getMetadata, uploadBytes } from 'firebase/storage';
