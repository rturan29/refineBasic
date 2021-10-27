import dayjs from "dayjs";
import moment from "moment";

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
    const time = data.dayTime?.time?.map(time => {
        let timeList = time.split(":");
        return moment().hour(timeList?.[0])?.minutes(timeList?.[1]);
    });

    return {
        ...data,
        period: data.period?.map(date => dayjs(date)),
        dayTime: { day: data.dayTime?.day, time },
        participants: data.participants || [],
        description: data.description || "",
    };
}