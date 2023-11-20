import { createContext } from 'react'

export enum ThemeEnum {
  Dark = 'dark',
  Light = 'light',
}

export interface ThemeContextType {
  theme: ThemeEnum
  setTheme: (theme: ThemeEnum) => void
}

export const ThemeContext = createContext<ThemeContextType | null>(null)

export const getTheme = (): ThemeEnum => {
  return ((localStorage.getItem('theme') as ThemeEnum | null) != null) || ThemeEnum.Light
}

export const setTheme = (theme: ThemeEnum) => {
  localStorage.setItem('theme', theme)
}
