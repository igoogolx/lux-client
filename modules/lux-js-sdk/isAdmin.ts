import axios from "axios";
import { urtConfig } from "./url";
import { GetIsAdmin } from "./types";

export const getIsAdmin: GetIsAdmin = async () => {
  const res = await axios.get(urtConfig.isAdmin);
  return res.data;
};
