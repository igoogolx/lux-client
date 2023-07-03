import axios from "axios";
import { UpdateSelectedRuleId } from "./types";
import { urtConfig } from "./url";

export const updateSelectedRuleId: UpdateSelectedRuleId = async (req) => {
  const { id } = req;
  const url = `${urtConfig.selected}/rule`;
  await axios.post(url, { id });
};

export const updateSelectedProxyId: UpdateSelectedRuleId = async (req) => {
  const { id } = req;
  const url = `${urtConfig.selected}/proxy`;
  await axios.post(url, { id });
};
