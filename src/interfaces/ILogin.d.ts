import { User } from "firebase/auth";

export interface ILoginArgs {
    email: string;
    password: string;
    remember: boolean;
}

export interface ILoginProps {
    setLocation: (location: string) => void;
}

export interface IRegisterProps {
    setReCaptchaContainer: (ref: RefObject<HTMLDivElement>) => void;
}

export interface IRegisterArgs extends ILoginArgs {
    phone?: string;
    nameSurname?: string;
}

export interface IUser extends Partial<User> {
    email: string;
    name?: string;
}

export type LoginLocationTypes = "login" | "forgotPassword" | "register";