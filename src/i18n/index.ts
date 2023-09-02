import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";

i18n.use(initReactI18next).init({
  lng: "en",
  debug: process.env.NODE_ENV === "development",
  returnObjects: true,
  resources: {
    en: {
      translation: en,
    },
  },
});
