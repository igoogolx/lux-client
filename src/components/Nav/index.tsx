import { ROUTER_NAME, ROUTER_PATH } from "@/utils/constants";
import {
  makeStyles,
  NavDrawer,
  NavDrawerBody,
  NavItem,
} from "@fluentui/react-components";
import {
  bundleIcon,
  HomeFilled,
  HomeRegular,
  InfoFilled,
  InfoRegular,
  NoteFilled,
  NoteRegular,
  RowTripleFilled,
  RowTripleRegular,
  SettingsFilled,
  SettingsRegular,
  TopSpeedFilled,
  TopSpeedRegular,
} from "@fluentui/react-icons";
import * as React from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    paddingTop: "16px",
    width: "100%",
    height: "100%",
  },
});

interface NavProps {
  onClick?: () => void;
}
export function Nav(props: Readonly<NavProps>): React.ReactNode {
  const { onClick } = props;

  const { t } = useTranslation();
  const items = useMemo(() => {
    const HomeIcon = bundleIcon(HomeFilled, HomeRegular);
    const RulesIcon = bundleIcon(RowTripleFilled, RowTripleRegular);
    const DataIcon = bundleIcon(TopSpeedFilled, TopSpeedRegular);
    const LogIcon = bundleIcon(NoteFilled, NoteRegular);
    const SettingIcon = bundleIcon(SettingsFilled, SettingsRegular);
    const AboutIcon = bundleIcon(InfoFilled, InfoRegular);

    return [
      {
        to: ROUTER_PATH.Home,
        icon: <HomeIcon />,
        name: ROUTER_NAME[ROUTER_PATH.Home],
      },
      {
        to: ROUTER_PATH.Rules,
        icon: <RulesIcon />,
        name: ROUTER_NAME[ROUTER_PATH.Rules],
      },
      {
        to: ROUTER_PATH.Dashboard,
        icon: <DataIcon />,
        name: ROUTER_NAME[ROUTER_PATH.Dashboard],
      },
      {
        to: ROUTER_PATH.Logger,
        icon: <LogIcon />,
        name: ROUTER_NAME[ROUTER_PATH.Logger],
      },
      {
        to: ROUTER_PATH.Setting,
        icon: <SettingIcon />,
        name: ROUTER_NAME[ROUTER_PATH.Setting],
      },
      {
        to: ROUTER_PATH.About,
        icon: <AboutIcon />,
        name: ROUTER_NAME[ROUTER_PATH.About],
      },
    ];
  }, []);

  const inStyles = useStyles();

  const navigate = useNavigate();

  const location = useLocation();

  return (
    <NavDrawer
      defaultSelectedValue={location.pathname}
      open
      type={"inline"}
      className={inStyles.root}
    >
      <NavDrawerBody>
        {items.map((item) => (
          <NavItem
            icon={item.icon}
            value={item.to}
            key={item.to}
            onClick={() => {
              navigate(item.to);
              onClick?.();
            }}
          >
            {t(item.name)}
          </NavItem>
        ))}
      </NavDrawerBody>
    </NavDrawer>
  );
}
