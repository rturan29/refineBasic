import { workshopType } from "interfaces";
import MLTextHelper from "./MLHelper";

export default function getWorkshopType(type: workshopType) {
    switch (type) {
        case "group":
            return MLTextHelper("00052");
        case "private":
            return MLTextHelper("00053");
        default:
            return "";
    }
}