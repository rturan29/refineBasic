import { FirebaseAuth, FirestoreDatabase, initializeFirebase } from "refine-firebase";
import { requestPayloadFactory } from "./requestPayloadFactory";
import { responsePayloadFactory } from "./responsePayloadFactory";

export const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL
};

export const firebaseApp = initializeFirebase(firebaseConfig);

const payloadFactoryMethods = {
    requestPayloadFactory,
    responsePayloadFactory
};

console.log(firebaseApp)

export const firebaseAuth = new FirebaseAuth();

console.log(firebaseAuth)

export const firestoreDatabase = new FirestoreDatabase(payloadFactoryMethods);