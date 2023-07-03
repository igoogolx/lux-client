import axios from "axios";
import { GetStatus, Start, Stop } from "./types";
import { urtConfig } from "./url";

export const start: Start = async () => {
  const url = `${urtConfig.manager}/start`;
  await axios.post(url);
};

export const stop: Stop = async () => {
  const url = `${urtConfig.manager}/stop`;
  await axios.post(url);
};

export const getStatus: GetStatus = async () => {
  const res = await axios.get(urtConfig.manager);
  return res.data;
};
