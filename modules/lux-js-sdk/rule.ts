import axios from "axios";
import { GetRules } from "./types";
import { urtConfig } from "./url";

export const getRules: GetRules = async () => {
  const url = `${urtConfig.rule}`;
  const res = await axios.get(url);
  res.data.rules = res.data.rules.map((str: string) => ({
    id: str,
    value: str,
  }));
  return res.data;
};
