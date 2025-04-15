import { MAX_PORT, MIN_PORT } from "@/utils/validator";
import { ObfsModeEnum } from "lux-js-sdk";
import * as Yup from "yup";

export function getShadowsocksSchema(t: (key: string) => string) {
  return Yup.object().shape({
    name: Yup.string(),
    server: Yup.string().required(t("required")),
    port: Yup.number().min(MIN_PORT).max(MAX_PORT).required(t("required")),
    password: Yup.string().required(t("required")),
    method: Yup.string(),
  });
}

export function getObfsPluginSchema(t: (key: string) => string) {
  return Yup.object().shape({
    host: Yup.string().required(t("required")),
    mode: Yup.string()
      .matches(new RegExp(`(${ObfsModeEnum.Tls}|${ObfsModeEnum.Http})`))
      .required(t("required")),
  });
}

export function getV2rayPluginSchema(t: (key: string) => string) {
  return Yup.object().shape({
    host: Yup.string().required(t("required")),
    port: Yup.number().required(t("required")),
    path: Yup.string().required(t("required")),
    mode: Yup.string()
      .matches(/websocket/)
      .required(t("required")),
  });
}

export function getRuleSchema(t: (key: string) => string) {
  return Yup.object().shape({
    ruleType: Yup.string().required(t("required")),
    policy: Yup.string().required(t("required")),
    payload: Yup.string().required(t("required")),
  });
}

export function getHttpSchema(t: (key: string) => string) {
  return Yup.object().shape({
    name: Yup.string(),
    server: Yup.string().required(t("required")),
    port: Yup.number().min(MIN_PORT).max(MAX_PORT).required(t("required")),
    username: Yup.string(),
    password: Yup.string(),
  });
}
