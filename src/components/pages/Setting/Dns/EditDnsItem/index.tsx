import React, { useEffect, useState } from "react";
import {
  Caption1,
  Combobox,
  type DropdownProps,
  Option,
  Subtitle2,
} from "@fluentui/react-components";
import { useSelector } from "react-redux";
import { type RootState } from "@/reducers";
import styles from "../../index.module.css";
import { type MenuItemProps, notifier } from "../../../../Core";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { useTranslation } from "react-i18next";

interface EditDnsItemProps {
  items: MenuItemProps[];
  title: string;
  desc: string;
  selectedOptions: DropdownProps["selectedOptions"];
  onOptionSelect: DropdownProps["onOptionSelect"];
}

const DNS_LABEL: Record<string, string> = {
  "tcp://114.114.114.114:53": "114(China)",
  "tcp://119.29.29.29:53": "119(China)",
  "tcp://8.8.8.8:53": "8(Google)",
  "tcp://1.1.1.1:53": "1(Cloudflare)",
  "https://dns.google/dns-query": "https(Google)",
  "https://cloudflare-dns.com/dns-query": "https(Cloudflare)",
  "https://doh.pub/dns-query": "https(China)",
  "dhcp://auto": "auto(Dhcp)",
};

export default function EditDnsItem(props: EditDnsItemProps) {
  const { items, title, desc, selectedOptions, onOptionSelect } = props;

  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared || state.manager.isLoading,
  );
  const { t } = useTranslation();

  const [value, setValue] = useState("");

  const handelOnOptionSelect: DropdownProps["onOptionSelect"] = (e, data) => {
    if (data.selectedOptions.length === 0) {
      notifier.warn(t(TRANSLATION_KEY.EMPTY_DNS));
      return;
    }
    if (onOptionSelect) {
      onOptionSelect(e, data);
    }
  };

  useEffect(() => {
    setValue(
      selectedOptions
        ? selectedOptions.map((item) => DNS_LABEL[item] || item).join(",")
        : "",
    );
  }, [selectedOptions]);

  return (
    <div className={styles.cardItem}>
      <div className={styles.desc}>
        <Subtitle2>{title}</Subtitle2>
        <Caption1>{desc}</Caption1>
      </div>
      <Combobox
        value={value}
        multiselect={true}
        disabled={isStarted}
        selectedOptions={selectedOptions}
        onOptionSelect={handelOnOptionSelect}
      >
        {items.map((option) => (
          <Option key={option.id} text={option.id as string}>
            {option.content}
          </Option>
        ))}
      </Combobox>
    </div>
  );
}
