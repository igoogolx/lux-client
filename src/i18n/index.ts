import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getSetting } from "lux-js-sdk";
import enUS from "./locales/en_us";

enum I18nLang {
  EN_US = "en-US",
}

export function getLang(value?: string) {
  if (value === I18nLang.EN_US) {
    return value;
  }
  return I18nLang.EN_US;
}

function initLanguage(language?: string) {
  return i18n.use(initReactI18next).init({
    lng: getLang(language),
    debug: process.env.NODE_ENV === "development",
    returnObjects: true,
    resources: {
      [I18nLang.EN_US]: {
        translation: enUS,
      },
    },
  });
}

export async function initI18n() {
  await initLanguage();
  getSetting().then((setting) => {
    i18n.changeLanguage(setting.language);
  });
}
