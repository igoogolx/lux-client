import * as Yup from "yup";
import { ObfsModeEnum } from "lux-js-sdk";
import { MAX_PORT, MIN_PORT } from "@/utils/validator";

export const ShadowsocksSchema = Yup.object().shape({
  name: Yup.string(),
  server: Yup.string().required("Required"),
  port: Yup.number().min(MIN_PORT).max(MAX_PORT).required("Required"),
  password: Yup.string().required("Required"),
  method: Yup.string(),
});

export const ObfsPluginSchema = Yup.object().shape({
  host: Yup.string().required("Required"),
  mode: Yup.string()
    .matches(new RegExp(`(${ObfsModeEnum.Tls}|${ObfsModeEnum.Http})`))
    .required("Required"),
});

export const V2rayPluginSchema = Yup.object().shape({
  host: Yup.string().required("Required"),
  port: Yup.number().required("Required"),
  path: Yup.string().required("Required"),
  mode: Yup.string()
    .matches(/websocket/)
    .required("Required"),
});

export const RuleSchema = Yup.object().shape({
  ruleType: Yup.string().required("Required"),
  policy: Yup.string().required("Required"),
  payload: Yup.string().required("Required"),
});
