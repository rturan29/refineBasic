import * as _ from "lodash";
import { IAvailablePlan, IPlan } from "./interfaces";

function getPlanTimes(time: [string, string]) {
    return _.range(
        Number((time[0]).split(":")[0]),
        Number((time[1]).split(":")[0]) + 1
    );
}

function getAvailablePlans(plans: IPlan[]): IAvailablePlan[] {
    const planDays = plans.map(({ day }) => day);

    return plans
        .filter(({ day }, index) => planDays.indexOf(day) == index)
        .map(plan => ({
            day: plan.day,
            time: _.flatten(plans
                .filter(({ day }) => day == plan.day)
                .map(({ time }) => getPlanTimes(time as [string, string]))
            ).sort((x, y) => x - y)
        }));
}

export { getAvailablePlans };