import moment from "moment";

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

    return {
        nameSurname: data.nameSurname,
        email: data.email,
        phone: data.phone || "",
        gender: data.gender || "other",
        workshops: data.workshops || []
    };
}

export function createWorkshopDataFactory(data: IWorkshop) {

    return {
        ...data,
        sessions: data.sessions || []
    };
}

export function createSessionDataFactory(data: ISession) {
    let result: any = {};

    if (data.participants?.length) {
        result.participants = {};
        data.participants.forEach(user => result.participants[user.participantId] = user);
    }

    console.log(data)

    if (data.period) {
        result.period = data.period.map(date => typeof date == "object" ? date.toISOString() : date)
    }
    if (data.dayTime) {
        result.dayTime = {
            day: data.dayTime.day,
            time: data.dayTime.time?.map(time => moment(time).format("HH:mm"))
        }
    }

    return {
        ...data,
        ...result,
        participants: data.participants || [],
    };
}