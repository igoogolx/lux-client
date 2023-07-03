import { createContext } from "react";

export enum ThemeEnum {
  Dark = "dark",
  Light = "light",
}

export type ThemeContextType = {
  theme: ThemeEnum;
  setTheme: (theme: ThemeEnum) => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const getTheme = (): ThemeEnum => {
  return <ThemeEnum | null>localStorage.getItem("theme") || ThemeEnum.Light;
};

export const setTheme = (theme: ThemeEnum) => {
  localStorage.setItem("theme", theme);
  window?.setClientTheme?.(theme);
};
