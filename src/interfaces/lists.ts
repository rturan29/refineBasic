import MLTextHelper from "helpers/MLHelper/MLHelper";

function getWeekDays() {
    let textKey = 4;
    let result = [];

    for (let day of new Array(6)) {
        result.push(MLTextHelper("0003" + textKey++));
    }

    result.push(MLTextHelper("00040"));

    return result;
}

export const weekDays = getWeekDays();