import textListTR from "./tr";
import textListEN from "./en";

export default function MLTextHelper(key: string) {
    // const locale = localStorage.getItem("locale") || "tr";
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