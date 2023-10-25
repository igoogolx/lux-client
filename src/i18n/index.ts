import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enUS from "./locales/en-US";
import zhCN from "./locales/zh-CN";

i18n.use(initReactI18next).init({
  lng: "en-US",
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
