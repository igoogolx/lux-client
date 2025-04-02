import { createContext } from "react";

export enum ThemeEnum {
  Dark = "dark",
  Light = "light",
  System = "system",
}

export interface ThemeContextType {
  theme: ThemeEnum;
  setTheme: (theme: ThemeEnum) => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const getInitTheme = (): ThemeEnum => {
  const params = new URL(window.location.href).searchParams;
  const themeFromParam = params.get("theme");
  if ([ThemeEnum.Dark, ThemeEnum.Light].includes(themeFromParam as ThemeEnum)) {
    return themeFromParam as ThemeEnum;
  }
  return ThemeEnum.Light;
};

export const getTheme = (): ThemeEnum => {
  return (localStorage.getItem("theme") as ThemeEnum | null) ?? ThemeEnum.Light;
};

export const setTheme = async (theme: ThemeEnum) => {
  localStorage.setItem("theme", theme);
};
