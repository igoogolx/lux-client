const Kb = 1024;
const Mb = 1024 * Kb;
const Gb = 1024 * Mb;

type ConvertedText = {
  value: string;
  unit: string;
};

export const convertByteToGb = (byte: number): ConvertedText => {
  return { value: (byte / Gb).toFixed(1), unit: "G" };
};

export const convertByteToMb = (byte: number): ConvertedText => {
  return { value: (byte / Mb).toFixed(1), unit: "M" };
};

export const convertByteToKb = (byte: number): ConvertedText => {
  return { value: (byte / Kb).toFixed(0), unit: "K" };
};

export const convertByte = (byte: number): ConvertedText => {
  if (byte < Mb) {
    return convertByteToKb(byte);
  }
  if (byte < Gb) {
    return convertByteToMb(byte);
  }
  return convertByteToGb(byte);
};
