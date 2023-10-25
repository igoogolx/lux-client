import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getSetting } from "lux-js-sdk";
import enUS from "./locales/en-US";
import zhCN from "./locales/zh-CN";

function initLanguage(language?: string) {
  return i18n.use(initReactI18next).init({
    lng: language || "en-US",
    debug: process.env.NODE_ENV === "development",
    returnObjects: true,
    resources: {
      "en-US": {
        translation: enUS,
      },
      "zh-CN": {
        translation: zhCN,
      },
    },
  });
}

export function initI18n() {
  return getSetting()
    .then((setting) => {
      return initLanguage(setting.language);
    })
    .catch(initLanguage);
}
