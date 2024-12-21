import { ROUTER_NAME, ROUTER_PATH } from "@/utils/constants";
import {
  makeStyles,
  mergeClasses,
  shorthands,
  Text,
} from "@fluentui/react-components";
import {
  HomeRegular,
  InfoRegular,
  NoteRegular,
  RowTripleRegular,
  SettingsRegular,
  TopSpeedRegular,
} from "@fluentui/react-icons";
import { tokens } from "@fluentui/react-theme";
import classNames from "classnames";
import * as React from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import styles from "./index.module.css";

const useStyles = makeStyles({
  nav: {
    ...shorthands.borderColor(tokens.colorPaletteSteelBorderActive),
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground1Selected,
    },
  },
  activeNav: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
  },
});

interface NavProps {
  onClick: () => void;
}
export function Nav(props: NavProps): React.ReactNode {
  const { onClick } = props;

  const { t } = useTranslation();
  const items = useMemo(() => {
    return [
      {
        to: ROUTER_PATH.Home,
        icon: <HomeRegular />,
        name: ROUTER_NAME[ROUTER_PATH.Home],
      },
      {
        to: ROUTER_PATH.Rules,
        icon: <RowTripleRegular />,
        name: ROUTER_NAME[ROUTER_PATH.Rules],
      },
      {
        to: ROUTER_PATH.Dashboard,
        icon: <TopSpeedRegular />,
        name: ROUTER_NAME[ROUTER_PATH.Dashboard],
      },
      {
        to: ROUTER_PATH.Logger,
        icon: <NoteRegular />,
        name: ROUTER_NAME[ROUTER_PATH.Logger],
      },
      {
        to: ROUTER_PATH.Setting,
        icon: <SettingsRegular />,
        name: ROUTER_NAME[ROUTER_PATH.Setting],
      },
      {
        to: ROUTER_PATH.About,
        icon: <InfoRegular />,
        name: ROUTER_NAME[ROUTER_PATH.About],
      },
    ];
  }, []);

  const inStyles = useStyles();

  return (
    <div className={styles.wrapper}>
      {items.map((item) => {
        return (
          <NavLink
            to={item.to}
            className={({ isActive }) => {
              return mergeClasses(
                inStyles.nav,
                classNames(styles.navItem, {
                  [styles.activeNavItem]: isActive,
                  [inStyles.activeNav]: isActive,
                }),
              );
            }}
            end
            key={item.to}
            onClick={onClick}
          >
            {() => {
              return (
                <>
                  {item.icon}
                  <Text className={styles.text}>{t(item.name)}</Text>
                </>
              );
            }}
          </NavLink>
        );
      })}
    </div>
  );
}
