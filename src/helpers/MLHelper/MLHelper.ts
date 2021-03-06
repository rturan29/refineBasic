import textListTR from "./tr";
import textListEN from "./en";
import { culture, IMultiLanguage } from "interfaces";

export function getCurrentCulture(): culture {
    return window.navigator.language.split("-")[0] as culture || "tr";
}

export default function MLTextHelper(key: string) {
    const locale = window.navigator.language || "tr";

    switch (locale) {
        case "en":
        case "en-EN":
            return textListEN[key];

        case "tr-TR":
        case "tr":
        default:
            return textListTR[key];
    }

}

export function getMLText(multilanguage: IMultiLanguage) {
    const currentCulture = getCurrentCulture();
    return multilanguage[currentCulture];
}