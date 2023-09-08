import React, { useRef } from "react";
import { Card } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setSetting, SettingRes } from "lux-js-sdk";
import { RootState, settingSlice } from "@/reducers";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import styles from "../index.module.css";
import { notifier } from "../../../Core";
import EditDnsItem from "./EditDnsItem";
import { DnsTypeEnum } from "../../../Core/EditItemWithSelectDialog";

const BOOST_DNS = ["114.114.114.114:53", "119.29.29.29:53"];

const REMOTE_DNS = [
  "8.8.8.8:53",
  "1.1.1.1:53",
  "https://dns.google/dns-query",
  "https://cloudflare-dns.com/dns-query",
];

const LOCAL_DNS = [
  "114.114.114.114:53",
  "119.29.29.29:53",
  "https://doh.pub/dns-query",
];

export default function Dns() {
  const { t } = useTranslation();

  const remoteDnsOptions = useRef(
    REMOTE_DNS.map((item) => ({ content: item, id: item }))
  );

  const localDnsOptions = useRef(
    LOCAL_DNS.map((item) => ({ content: item, id: item }))
  );

  const boostDnsOptions = useRef(
    BOOST_DNS.map((item) => ({ content: item, id: item }))
  );

  const setting = useSelector<RootState, SettingRes>((state) => state.setting);

  const dispatch = useDispatch();

  const onSubmit = async (newDns: SettingRes["dns"]) => {
    const newSetting = {
      ...setting,
      dns: newDns,
    };

    await setSetting(newSetting);
    dispatch(settingSlice.actions.setSetting(newSetting));
    notifier.success(t(TRANSLATION_KEY.SAVE_SUCCESS));
  };

  const hasDoh =
    setting.dns.remote.value.startsWith("https") ||
    setting.dns.local.value.startsWith("https");

  return (
    <Card className={styles.card}>
      <EditDnsItem
        type={setting.dns.remote.type as DnsTypeEnum}
        items={remoteDnsOptions.current}
        value={setting.dns.remote.value}
        onSubmit={(data) => {
          onSubmit({
            ...setting.dns,
            remote: {
              ...setting.dns.remote,
              ...data,
            },
          });
        }}
        title={t(TRANSLATION_KEY.REMOTE_DNS_LABEL)}
        desc={t(TRANSLATION_KEY.REMOTE_DNS_DESC)}
      />

      <EditDnsItem
        type={setting.dns.remote.type as DnsTypeEnum}
        items={localDnsOptions.current}
        value={setting.dns.local.value}
        onSubmit={(data) => {
          onSubmit({
            ...setting.dns,
            local: {
              ...setting.dns.local,
              ...data,
            },
          });
        }}
        title={t(TRANSLATION_KEY.LOCAL_DNS_LABEL)}
        desc={t(TRANSLATION_KEY.LOCAL_DNS_DESC)}
      />
      {hasDoh && (
        <EditDnsItem
          type={setting.dns.boost.type as DnsTypeEnum}
          items={boostDnsOptions.current}
          value={setting.dns.boost.value}
          onSubmit={(data) => {
            onSubmit({
              ...setting.dns,
              boost: {
                ...setting.dns.boost,
                ...data,
              },
            });
          }}
          title={t(TRANSLATION_KEY.BOOST_DNS_LABEL)}
          desc={t(TRANSLATION_KEY.BOOST_DNS_DESC)}
        />
      )}
    </Card>
  );
}
