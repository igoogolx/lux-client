import pkg from "../../../../package.json";

export const getVersion = () => {
  return process.env.CLIENT_VERSION || pkg.version;
};
