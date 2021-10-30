import * as functions from "firebase-functions";

import * as admin from "firebase-admin";
import { firestore } from "firebase-admin";

admin.initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const onAppendNewSession = functions.firestore.document("sessions/{sessionId}").onCreate(async (snapshot, context) => {

    const { workshopId } = snapshot.data();

    await admin.firestore().collection("workshops").doc(workshopId).update({
        sessions: firestore.FieldValue.arrayUnion(snapshot.id)
    });
});

export const onDeleteSession = functions.firestore.document("sessions/{sessionId").onDelete(async (snapshot, context) => {
    const { workshopId, participants } = snapshot.data();

    await admin.firestore().collection("workshops").doc(workshopId).update({
        sessions: firestore.FieldValue.arrayRemove(snapshot.id)
    });

    participants?.forEach(async (participantId: string) => {
        await admin.firestore().collection("users").doc(participantId).update({
            workshops: firestore.FieldValue.arrayRemove(snapshot.id)
        });
    });
});