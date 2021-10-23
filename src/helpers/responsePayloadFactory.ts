import dayjs from "dayjs";

export function responsePayloadFactory(resource: string, payload: any) {
    switch (resource) {
        case "courses":
            return getCourseDataFactory(payload);

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
        courses: data.courses || [],
    };
}

export function getCourseDataFactory(data: ICourse) {
    return {
        id: data.id,
        title: data.title,
        category: data.category,
        description: data.description,
        status: data.status,
        sessions: data.sessions || [],
    };
}

export function getSessionDataFactory(data: ISession) {
    return {
        ...data,
        startDate: dayjs(data.startDate),
        endDate: dayjs(data.endDate),
        participants: data.participants || [],
        description: data.description || "",
    };
}