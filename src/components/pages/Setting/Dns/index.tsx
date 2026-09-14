import AddDnsOption from "@/components/pages/Setting/Dns/AddDnsOption";
import TunTag from "@/components/pages/Setting/TunTag";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { type RootState, settingSlice } from "@/reducers";
import { DNS_SERVER_TYPE } from "@/utils/constants.ts";
import { Caption1, Card, Subtitle2, Switch } from "@fluentui/react-components";
import { uniq } from "lodash";
import { setSetting, type SettingRes } from "lux-js-sdk";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { notifier } from "../../../Core";
import styles from "../index.module.css";
import EditDnsItem from "./EditDnsItem";

enum DNS_TYPE {
  REMOTE,
  BOOST,
  LOCAL,
}

const BOOST_DNS = [
  "tcp://114.114.114.114:53",
  "tcp://119.29.29.29:53",
  "dhcp://auto",
  "system://auto",
];

const REMOTE_DNS = [
  "tcp://8.8.8.8:53",
  "tcp://1.1.1.1:53",
  "https://dns.google/dns-query",
  "https://cloudflare-dns.com/dns-query",
];

const LOCAL_DNS = [
  "tcp://114.114.114.114:53",
  "tcp://119.29.29.29:53",
  "https://doh.pub/dns-query",
  "dhcp://auto",
  "system://auto",
];

const VALID_BOOST_DNS_PREFIXES = [
  DNS_SERVER_TYPE.TCP,
  DNS_SERVER_TYPE.UDP,
  DNS_SERVER_TYPE.DHCP,
  DNS_SERVER_TYPE.SYSTEM,
];

export default function Dns() {
  const { t } = useTranslation();

  const setting = useSelector<RootState, SettingRes>((state) => state.setting);

  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared || state.manager.isLoading,
  );

  const remoteDnsOptions = useMemo(
    () =>
      uniq([...REMOTE_DNS, ...setting.dns.customizedOptions]).map((item) => ({
        content: item,
        id: item,
      })),
    [setting.dns.customizedOptions],
  );

  const localDnsOptions = useMemo(
    () =>
      uniq([...LOCAL_DNS, ...setting.dns.customizedOptions]).map((item) => ({
        content: item,
        id: item,
      })),
    [setting.dns.customizedOptions],
  );

  const boostDnsOptions = useMemo(
    () =>
      uniq([...BOOST_DNS, ...setting.dns.customizedOptions])
        .filter((item) =>
          VALID_BOOST_DNS_PREFIXES.some((p) => item.startsWith(p)),
        )
        .map((item) => ({
          content: item,
          id: item,
        })),
    [setting.dns.customizedOptions],
  );

  const dispatch = useDispatch();

  const onSubmit = async (items: string[], dnsType: DNS_TYPE) => {
    let newDns = { ...setting.dns };
    switch (dnsType) {
      case DNS_TYPE.REMOTE: {
        newDns = { ...newDns, server: { ...newDns.server, remote: items } };
        break;
      }
      case DNS_TYPE.LOCAL: {
        newDns = { ...newDns, server: { ...newDns.server, local: items } };
        break;
      }
      case DNS_TYPE.BOOST: {
        newDns = { ...newDns, server: { ...newDns.server, boost: items } };
        break;
      }
    }
    const newSetting = {
      ...setting,
      dns: newDns,
    };
    await setSetting(newSetting);
    dispatch(settingSlice.actions.setSetting(newSetting));
    notifier.success(t(TRANSLATION_KEY.SAVE_SUCCESS));
  };

  const setDisableCache = async (value: boolean) => {
    const newSetting = {
      ...setting,
      dns: { ...setting.dns, disableCache: value },
    };
    await setSetting(newSetting);
    dispatch(settingSlice.actions.setSetting(newSetting));
    notifier.success(t(TRANSLATION_KEY.SAVE_SUCCESS));
  };

  const onSubmitFakeIp = async (fakeIp: SettingRes["dns"]["fakeIp"]) => {
    const newSetting = {
      ...setting,
      dns: {
        ...setting.dns,
        fakeIp,
      },
    };
    await setSetting(newSetting);
    dispatch(settingSlice.actions.setSetting(newSetting));
    notifier.success(t(TRANSLATION_KEY.SAVE_SUCCESS));
  };

  return (
    <Card className={styles.card}>
      <AddDnsOption />
      <div className={styles.cardItem}>
        <div className={styles.desc}>
          <Subtitle2>
            {t(TRANSLATION_KEY.FAKE_IP_SWITCH_LABEL)}
            <TunTag />
          </Subtitle2>
          <Caption1>{t(TRANSLATION_KEY.FAKE_IP_SWITCH_TOOLTIP)}</Caption1>
        </div>
        <Switch
          checked={setting.dns.fakeIp}
          onChange={(_, data) => {
            onSubmitFakeIp(data.checked).catch((e) => {
              console.error(e);
            });
          }}
          disabled={isStarted}
        />
      </div>

      {!setting.dns.fakeIp && (
        <EditDnsItem
          items={remoteDnsOptions}
          onOptionSelect={(_, data) => {
            onSubmit(data.selectedOptions, DNS_TYPE.REMOTE).catch((e) => {
              console.error(e);
            });
          }}
          selectedOptions={setting.dns.server.remote}
          title={t(TRANSLATION_KEY.REMOTE_DNS_LABEL)}
          desc={t(TRANSLATION_KEY.REMOTE_DNS_DESC)}
        />
      )}
      <EditDnsItem
        items={localDnsOptions}
        onOptionSelect={(_, data) => {
          onSubmit(data.selectedOptions, DNS_TYPE.LOCAL).catch((e) => {
            console.error(e);
          });
        }}
        selectedOptions={setting.dns.server.local}
        title={t(TRANSLATION_KEY.LOCAL_DNS_LABEL)}
        desc={t(TRANSLATION_KEY.LOCAL_DNS_DESC)}
      />
      <EditDnsItem
        items={boostDnsOptions}
        onOptionSelect={(_, data) => {
          onSubmit(data.selectedOptions, DNS_TYPE.BOOST).catch((e) => {
            console.error(e);
          });
        }}
        selectedOptions={setting.dns.server.boost}
        title={t(TRANSLATION_KEY.BOOST_DNS_LABEL)}
        desc={t(TRANSLATION_KEY.BOOST_DNS_DESC, {
          servers: VALID_BOOST_DNS_PREFIXES.join(", "),
        })}
      />
      <div className={styles.cardItem}>
        <div className={styles.desc}>
          <Subtitle2>
            {t(TRANSLATION_KEY.DISABLE_DNS_CACHE_SWITCH_LABEL)}
            <TunTag />
          </Subtitle2>
          <Caption1>
            {t(TRANSLATION_KEY.DISABLE_DNS_CACHE_SWITCH_TOOLTIP)}
          </Caption1>
        </div>
        <Switch
          checked={setting.dns.disableCache}
          onChange={(_, data) => {
            setDisableCache(data.checked).catch((e) => {
              console.error(e);
            });
          }}
          disabled={isStarted}
        />
      </div>
    </Card>
  );
}
