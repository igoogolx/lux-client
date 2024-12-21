import axios from "axios";
import { GetIsAdmin } from "./types";
import { urtConfig } from "./url";

export const getIsAdmin: GetIsAdmin = async () => {
  const res = await axios.get(urtConfig.isAdmin);
  return res.data;
};
