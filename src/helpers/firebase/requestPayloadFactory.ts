import moment from "moment";
import { IUser, IWorkshop, ISession } from "interfaces";

export function requestPayloadFactory(resource: string, payload: any) {
    switch (resource) {
        case "workshops":
            return createWorkshopDataFactory(payload);

        case "sessions":
            return createSessionDataFactory(payload);

        case "users":
            return createUserDataFactory(payload);

        default:
            return payload;
    }
}

export function createUserDataFactory(data: IUser) {
    const { nameSurname, email, phone, gender, workshops } = data;
    let result: any = {};
    if (nameSurname) {
        result.nameSurname = nameSurname;
    }

    if (email) {
        result.email = email;
    }

    if (phone) {
        result.phone = phone;
    }

    if (gender) {
        result.gender = gender;
    }

    if (workshops) {
        result.workshops = workshops;
    }

    return {
        ...result
    };
}

export function createWorkshopDataFactory(data: IWorkshop) {

    return {
        ...data
    };
}

export function createSessionDataFactory(data: ISession) {

    if (data.period?.length) {
        data.period = data.period.map(date => (date as any).toDate()) as any;
    }

    if (data.plans?.length) {
        data.plans = data.plans.map(plan => ({
            day: plan.day,
            time: plan.time?.map(time => moment(time).format("HH:mm")) as [string, string]
        }));
    }

    return {
        ...data
    };
}