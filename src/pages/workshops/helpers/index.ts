import { CrudFilter } from "@pankod/refine";
import MLTextHelper from "helpers/MLHelper/MLHelper";

export function getWorkshopLabel(workshop: string) {
    switch (workshop) {
        case "visualArts":
            return MLTextHelper("00037");
        case "auditoryArts":
            return MLTextHelper("00038");
        case "foreignLanguage":
            return MLTextHelper("00039");
        default:
            return "";
    }
}

export function getPermanentFilter(isAdmin: boolean): CrudFilter[] {

    return isAdmin
        ? []
        : [{
            field: "status",
            operator: "eq",
            value: "published"
        }];

}