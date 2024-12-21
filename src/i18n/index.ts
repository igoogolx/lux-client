import i18n from "i18next";
import { getSetting } from "lux-js-sdk";
import { initReactI18next } from "react-i18next";
import enUS from "./locales/en_us";
import zhCN from "./locales/zh_cn";

export enum LANGUAGE_ENUM {
  SYSTEM = "system",
  EN_US = "en-US",
  ZH_CN = "zh-CN",
}

export function getLang(value?: string) {
  let curValue = value;
  if (value === LANGUAGE_ENUM.SYSTEM) {
    curValue = navigator.language;
  }
  if (curValue === LANGUAGE_ENUM.EN_US || curValue === LANGUAGE_ENUM.ZH_CN) {
    return curValue;
  }
  return LANGUAGE_ENUM.EN_US;
}

async function initLanguage(language?: string) {
  return await i18n.use(initReactI18next).init({
    lng: getLang(language),
    debug: process.env.NODE_ENV === "development",
    returnObjects: true,
    resources: {
      [LANGUAGE_ENUM.EN_US]: {
        translation: enUS,
      },
      [LANGUAGE_ENUM.ZH_CN]: {
        translation: zhCN,
      },
    },
  });
}

export async function initI18n() {
  await initLanguage();
  getSetting().then((setting) => {
    i18n.changeLanguage(getLang(setting.language));
  });
}
