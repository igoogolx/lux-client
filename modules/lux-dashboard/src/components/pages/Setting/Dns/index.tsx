import React, { useRef } from "react";
import styles from "@/components/pages/Setting/index.module.css";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import {
  Caption1,
  Card,
  Dropdown,
  Option,
  Subtitle2,
} from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState, settingSlice } from "@/reducers";
import { setSetting, SettingRes } from "lux-js-sdk";
import { notifier } from "@/components/Core";

const BOOST_DNS = ["114.114.114.114", "119.29.29.29"];

const REMOTE_DNS = ["8.8.8.8", "1.1.1.1", "https://dns.google/dns-query"];

const LOCAL_DNS = [
  "114.114.114.114",
  "119.29.29.29",
  "https://doh.pub/dns-query",
];

export default function Dns() {
  const { t } = useTranslation();

  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared || state.manager.isLoading
  );

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
      <div className={styles.cardItem}>
        <div className={styles.desc}>
          <Subtitle2>{t(TRANSLATION_KEY.REMOTE_DNS_LABEL)}</Subtitle2>
          <Caption1>{t(TRANSLATION_KEY.REMOTE_DNS_DESC)}</Caption1>
        </div>
        <Dropdown
          disabled={isStarted}
          value={setting.dns.remote.value}
          onOptionSelect={(e, data) => {
            onSubmit({
              ...setting.dns,
              remote: {
                ...setting.dns.remote,
                value: data.optionValue as string
              },
            });
          }}
        >
          {remoteDnsOptions.current.map((option) => (
            <Option key={option.id} value={option.id}>
              {option.content}
            </Option>
          ))}
        </Dropdown>
      </div>
      <div className={styles.cardItem}>
        <div className={styles.desc}>
          <Subtitle2>{t(TRANSLATION_KEY.LOCAL_DNS_LABEL)}</Subtitle2>
          <Caption1>{t(TRANSLATION_KEY.LOCAL_DNS_DESC)}</Caption1>
        </div>
        <Dropdown
          disabled={isStarted}
          value={setting.dns.local.value}
          onOptionSelect={(e, data) => {
            onSubmit({
              ...setting.dns,
              local: {
                ...setting.dns.boost,
                value: data.optionValue as string
              },
            });
          }}
        >
          {localDnsOptions.current.map((option) => (
            <Option key={option.id} value={option.id}>
              {option.content}
            </Option>
          ))}
        </Dropdown>
      </div>

      {hasDoh && (
        <div className={styles.cardItem}>
          <div className={styles.desc}>
            <Subtitle2>{t(TRANSLATION_KEY.BOOST_DNS_LABEL)}</Subtitle2>
            <Caption1>{t(TRANSLATION_KEY.BOOST_DNS_DESC)}</Caption1>
          </div>
          <Dropdown
            disabled={isStarted}
            value={setting.dns.boost.value}
            onOptionSelect={(e, data) => {
              onSubmit({
                ...setting.dns,
                boost: {
                  ...setting.dns.boost,
                  value: data.optionValue as string
                },
              });
            }}
          >
            {boostDnsOptions.current.map((option) => (
              <Option key={option.id} value={option.id}>
                {option.content}
              </Option>
            ))}
          </Dropdown>
        </div>
      )}
    </Card>
  );
}
