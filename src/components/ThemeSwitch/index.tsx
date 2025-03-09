import {
  getInitTheme,
  setTheme,
  ThemeContext,
  type ThemeContextType,
  ThemeEnum,
} from "@/utils/theme";
import { Button, makeStyles } from "@fluentui/react-components";
import { WeatherMoonRegular, WeatherSunnyRegular } from "@fluentui/react-icons";
import { tokens } from "@fluentui/react-theme";
import classNames from "classnames";
import React, { useContext, useEffect } from "react";
import styles from "./index.module.css";

const useStyles = makeStyles({
  selected: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
  },
});

export default function ThemeSwitch(): React.ReactNode {
  const { theme: currentTheme, setTheme: setCurrentTheme } = useContext(
    ThemeContext,
  ) as ThemeContextType;

  const inStyles = useStyles();

  useEffect(() => {
    const theme = getInitTheme();
    setCurrentTheme(theme);
  }, [setCurrentTheme]);

  const onClick = () => {
    if (currentTheme === ThemeEnum.Light) {
      setCurrentTheme(ThemeEnum.Dark);
      setTheme(ThemeEnum.Dark);
    } else {
      setTheme(ThemeEnum.Light);
      setCurrentTheme(ThemeEnum.Light);
    }
  };

  return (
    <Button onClick={onClick} className={styles.container}>
      <div
        className={classNames(styles.item, {
          [inStyles.selected]: currentTheme === ThemeEnum.Light,
        })}
      >
        <WeatherSunnyRegular />
      </div>
      <div
        className={classNames(styles.item, {
          [inStyles.selected]: currentTheme === ThemeEnum.Dark,
        })}
      >
        <WeatherMoonRegular />
      </div>
    </Button>
  );
}
