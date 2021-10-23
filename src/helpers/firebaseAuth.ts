import { IAuthContext } from "@pankod/refine/dist/interfaces";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, User, updateEmail, updatePassword, getAuth, signOut, Auth, RecaptchaVerifier, RecaptchaParameters, updateProfile, sendEmailVerification, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";

import { IRegisterArgs, LoginLocationTypes, ILoginArgs, IUser } from "interfaces/ILogin";
import { firebaseDatabase } from "./firebaseDatabase";

export class FirebaseAuth {

    auth: Auth;

    constructor () {
        this.auth = getAuth();
        this.auth.useDeviceLanguage();

        this.getAuthProvider = this.getAuthProvider.bind(this);
        this.handleLogIn = this.handleLogIn.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
        this.handleResetPassword = this.handleResetPassword.bind(this);
        this.handleUpdateEmail = this.handleUpdateEmail.bind(this);
        this.handleUpdatePassword = this.handleUpdatePassword.bind(this);
        this.onUpdateUserData = this.onUpdateUserData.bind(this);
        this.getUserIdentity = this.getUserIdentity.bind(this);
        this.handleCheckAuth = this.handleCheckAuth.bind(this);
        this.createRecaptcha = this.createRecaptcha.bind(this);
    }

    async handleLogOut() {
        await signOut(this.auth);
    }

    async handleUpdateUserData() {

    }

    async handleRegister(
        args: IRegisterArgs,
        recaptchaVerifier: RecaptchaVerifier,
        setLocation: (value: React.SetStateAction<LoginLocationTypes>) => void
    ) {
        try {
            const { email, password, nameSurname } = args;
            const token = await recaptchaVerifier.verify();
            if (token) {
                const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
                await sendEmailVerification(userCredential.user);
                if (userCredential.user) {
                    firebaseDatabase.createData({ resource: "users", variables: args });
                    if (nameSurname) {
                        await updateProfile(userCredential.user, { displayName: nameSurname });
                    }
                }
                await setLocation("login");
            }
        } catch (err) {
            console.log(err);
        }
    }

    async handleLogIn({ email, password, remember }: ILoginArgs) {
        try {
            if (this.auth) {
                await this.auth.setPersistence(remember ? browserLocalPersistence : browserSessionPersistence);

                const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
                const userToken = await userCredential?.user?.getIdToken?.();
                if (userToken) {
                    return;
                } else {
                    await Promise.reject();
                }
            } else {
                await Promise.reject();
            }
        } catch (err) {

        }

    }

    handleResetPassword(email: string) {
        return sendPasswordResetEmail(this.auth, email);
    }

    handleUpdateEmail(currentUser: User, email: string) {
        return updateEmail(currentUser, email);
    }

    handleUpdatePassword(currentUser: User, password: string) {
        return updatePassword(currentUser, password);
    }

    async onUpdateUserData(
        args: IRegisterArgs,
        recaptchaVerifier: RecaptchaVerifier,) {

        try {
            if (this.auth.currentUser) {
                const { email, password, nameSurname, } = args;
                // if (password) {
                //     await handleUpdatePassword(this.auth.currentUser, password);
                // }

                // if (email) {
                //     await handleUpdateEmail(this.auth.currentUser, email);
                // }

                if (nameSurname) {
                    await updateProfile(this.auth.currentUser, { displayName: nameSurname });
                    firebaseDatabase.updateData({ id: "", resource: "users/nameSurname", variables: args.nameSurname });
                }

            }

        } catch (error) {

        }

    }

    async getUserIdentity(): Promise<IUser> {
        const user = this.auth?.currentUser;
        return {
            ...this.auth.currentUser,
            email: user?.email || "",
            name: user?.displayName || user?.email || ""
        };
    }

    async handleCheckAuth() {
        if (!this.auth?.currentUser) {
            await Promise.reject();
        }
    }

    createRecaptcha(containerOrId: string | HTMLDivElement, parameters: RecaptchaParameters) {
        const recaptchaVerifier = new RecaptchaVerifier(containerOrId, parameters, this.auth);
        return recaptchaVerifier;
    }

    getAuthProvider(): IAuthContext {
        return {
            login: this.handleLogIn,
            logout: this.handleLogOut,
            checkAuth: this.handleCheckAuth,
            checkError: () => Promise.resolve(),
            getPermissions: () => Promise.resolve(),
            getUserIdentity: this.getUserIdentity,
        };
    }

}

export const firebaseAuth = new FirebaseAuth();