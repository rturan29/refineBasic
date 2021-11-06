import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as dayjs from 'dayjs';
import { firestore } from "firebase-admin";

const onAppendNewSession = functions.firestore.document("sessions/{sessionId}").onCreate(async (snapshot, context) => {
    const { workshopId } = snapshot.data() as ISession;

    await admin.firestore().collection("workshops").doc(workshopId).update({
        sessions: firestore.FieldValue.arrayUnion(snapshot.id)
    });

    const workshopSnapshot = await admin.firestore().collection("workshops").doc(workshopId).get();

    await admin.firestore().collection("sessions").doc(snapshot.id).update({ type: workshopSnapshot.data()?.type });
});

const onDeleteSession = functions.firestore.document("sessions/{sessionId}").onDelete(async (snapshot, context) => {
    const { workshopId, participants } = snapshot.data() as ISession;

    await admin.firestore().collection("workshops").doc(workshopId)?.update({
        sessions: firestore.FieldValue.arrayRemove(snapshot.id)
    });

    participants?.forEach(async ({ participantId }) => {
        await admin.firestore().collection("users").doc(participantId)?.update({
            workshops: firestore.FieldValue.arrayRemove(snapshot.id)
        });
    });
});

const scheduleSessionStatus = functions.pubsub.schedule('0 0 * * *').timeZone('Turkey').onRun(async () => {

    const sessionCollection = await admin.firestore().collection("sessions").get();

    sessionCollection.docs.forEach(async sessionSnapshot => {
        const session = sessionSnapshot.data() as ISession;

        const isPast = dayjs().diff(session.period[0], "day") == 0;

        if (isPast) {
            await admin.firestore().collection("sessions").doc(sessionSnapshot.id).update({ status: "past" });
        }
    });
});

export { onAppendNewSession, onDeleteSession, scheduleSessionStatus };