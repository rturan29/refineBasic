export function requestPayloadFactory(resource: string, payload: any) {
    switch (resource) {
        case "courses":
            return createCourseDataFactory(payload);

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
        courses: data.courses || []
    };
}

export function createCourseDataFactory(data: ICourse) {

    return {
        ...data,
        sessions: data.sessions || []
    };
}

export function createSessionDataFactory(data: ISession) {
    let result: any = {};

    // if (data.participants?.length) {
    //     result.participants = {};
    //     data.participants.forEach(user => result.participants[user.participantId] = user);
    // }

    if (data.startDate) {
        result.startDate = typeof data.startDate == "object" ? data.startDate.toISOString() : data.startDate;
    }
    if (data.endDate) {
        result.endDate = typeof data.endDate == "object" ? data.endDate.toISOString() : data.endDate;
    }

    return {
        ...data,
        ...result,
        participants: data.participants || [],
    };
}