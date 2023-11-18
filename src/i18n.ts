import "react-i18next"
import enLang from "./translations/en.json"
import ptLang from "./translations/pt.json"
import i18next from "i18next"
import { initReactI18next } from "react-i18next"

// .use(LanguageDetector)
const userLanguage = //@ts-ignore
    (navigator.language || navigator.userLanguage).split("-")[0]

let defaultLanguage = "en" as LanguageKeys
if (["pt", "en"].includes(userLanguage)) defaultLanguage = userLanguage


i18next.use(initReactI18next).init({
    fallbackLng: defaultLanguage,
    debug: true,
    resources: {
        pt: {
            translation: ptLang,
        },
        en: {
            translation: enLang,
        },
    },
    detection: {},
})

declare module "react-i18next" {
    // and extend them!
    interface Resources {
        translation: typeof ptLang
    }
}

export type LanguageKeys = "pt" | "en"
