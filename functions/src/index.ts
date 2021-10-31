import * as admin from "firebase-admin";

import { onDeleteUser, onRegisterNewUser } from "./authFunctions";
import { onAppendNewSession, onDeleteSession } from "./databaseFunctions";

admin.initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript


export { onAppendNewSession, onDeleteSession, onRegisterNewUser, onDeleteUser };