import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const onRegisterNewUser = functions.auth.user().onCreate(async user => {
    const adminsSnapshot = await admin.firestore().collection("admins").doc("1").get();

    const adminUsers = adminsSnapshot.data();

    if (adminUsers?.adminList?.includes(user.email)) {
        await admin.auth().setCustomUserClaims(user.uid, { isAdmin: true });
    } else {
        await admin.auth().setCustomUserClaims(user.uid, { isAdmin: false });
    }
});

const onDeleteUser = functions.firestore.document("users/{userId}").onDelete(async (snapshot, context) => {
    const { email } = snapshot.data();
    const userRecord = await admin.auth().getUserByEmail(email);

    const authId = context.auth?.uid;

    if (authId) {
        const contextUserRecord = await admin.auth().getUser(authId);
        if (contextUserRecord.customClaims?.admin) {
            await admin.auth().deleteUser(userRecord.uid);
        }
    }
});

export { onRegisterNewUser, onDeleteUser };