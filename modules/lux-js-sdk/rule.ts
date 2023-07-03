import axios from "axios";
import { AddRule, DeleteRule, GetRules, UpdateRule } from "./types";
import { urtConfig } from "./url";

export const getRules: GetRules = async () => {
  const url = `${urtConfig.rule}`;
  const res = await axios.get(url);
  return res.data;
};

export const addRule: AddRule = async (req) => {
  const { rule } = req;
  const url = `${urtConfig.rule}`;
  await axios.put(url, rule);
};

export const deleteRule: DeleteRule = async (req) => {
  const { id } = req;
  const url = `${urtConfig.rule}/${id}`;
  await axios.delete(url);
};

export const updateRule: UpdateRule = async (req) => {
  const { rule, id } = req;
  const url = `${urtConfig.rule}/${id}`;
  await axios.post(url, rule);
};
