import dayjs from "dayjs";
import { IUser, IWorkshop, ISession } from "interfaces";
import moment, { Moment } from "moment";

export function responsePayloadFactory(resource: string, payload: any) {
    switch (resource) {
        case "workshops":
            return getWorkshopDataFactory(payload);

        case "sessions":
            return getSessionDataFactory(payload);

        case "users":
            return getUserDataFactory(payload);

        default:
            return payload;
    }
}

export function getUserDataFactory(data: IUser) {
    return {
        ...data,
        phone: data.phone || "",
        gender: data.gender || "other",
        workshops: data.workshops || [],
    };
}

export function getWorkshopDataFactory(data: IWorkshop) {
    return {
        id: data.id,
        title: data.title,
        category: data.category,
        description: data.description,
        status: data.status,
        sessions: data.sessions || [],
        type: data.type,
    };
}

export function getSessionDataFactory(data: ISession) {
    data.plans = data.plans?.map(plan => ({
        day: plan.day,
        time: getTimeFromString(plan.time)
    })) || [];

    data.period = data.period?.map(date => {
        const dateObj = typeof date == "string" ? date : (date as any).toDate?.();
        return dayjs(dateObj);
    }) as any;

    return {
        ...data,
        participants: data.participants || [],
        description: data.description || "",
    };
}

function getTimeFromString(timeList: [string, string]): [Moment, Moment] {
    return timeList?.map((time) => {
        let times = time.split(":");
        return moment().hour(Number(times?.[0]))?.minutes(Number(times?.[1]));
    }) as [Moment, Moment];
}