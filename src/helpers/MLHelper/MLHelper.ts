import textListTR from "./tr";
import textListEN from "./en";

export function getCurrentCulture() {
    return window.navigator.language.split("-")[0] || "tr";
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