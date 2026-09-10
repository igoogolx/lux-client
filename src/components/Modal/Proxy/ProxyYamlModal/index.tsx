import { notifier } from "@/components/Core";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { proxiesSlice } from "@/reducers";
import { CLASH_YAML_CONFIG_DOCS_URL } from "@/utils/constants.ts";
import { formatError } from "@/utils/error";
import { decodeClashYaml } from "@/utils/url";
import { Button, Link, Spinner, Textarea } from "@fluentui/react-components";
import axios from "axios";
import { addProxy, type BaseProxy, updateProxy } from "lux-js-sdk";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import styles from "./index.module.css";

interface ProxyYamlModalProps {
  close: () => void;
  initialValue?: BaseProxy;
}

const DEFAULT_VALUE = {
  proxies: [
    {
      name: "socks",
      type: "socks5",
      server: "example.com",
      port: 443,
    },
  ],
};

const INVALID_EDIT_KEYS: (keyof BaseProxy)[] = [
  "id",
  "delay",
  "subscription",
  "subscriptionUrl",
];

const formatValueToEdit = (value: BaseProxy) => {
  const newValue = { ...value };

  for (const key of INVALID_EDIT_KEYS) {
    delete newValue[key];
  }

  return newValue;
};

function ProxyYamlModal(props: Readonly<ProxyYamlModalProps>) {
  const { close, initialValue } = props;
  const { t } = useTranslation();

  const isEdit = !!initialValue;

  const [text, setText] = useState(
    stringifyYaml(isEdit ? formatValueToEdit(initialValue) : DEFAULT_VALUE),
  );

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (isEdit) {
        const parsedProxy = parseYaml(text);

        if (!(typeof parsedProxy === "object" && "type" in parsedProxy)) {
          throw new Error("invalid proxy config");
        }

        const newProxy = { ...initialValue, ...parsedProxy };

        await updateProxy({
          id: initialValue.id,
          proxy: newProxy,
        });
        dispatch(proxiesSlice.actions.updateOne({ proxy: newProxy }));
      } else {
        const proxyConfigs = decodeClashYaml(text);
        console.log(proxyConfigs);
        await Promise.all(
          proxyConfigs.map(async (proxyConfig) => {
            const proxy = { ...proxyConfig };
            const res = await addProxy({ proxy });
            dispatch(
              proxiesSlice.actions.addOne({
                proxy: { ...proxy, id: res.id },
              }),
            );
          }),
        );
      }

      close();
    } catch (e) {
      if (!axios.isAxiosError(e)) {
        notifier.error(formatError(e));
      }
    } finally {
      setLoading(false);
    }
  };

  const isValid = text.trim().length !== 0;

  return (
    <div className={styles.container}>
      <div>
        {t(t(TRANSLATION_KEY.YAML))} (
        <span>
          {`${t(TRANSLATION_KEY.SEE)} `}
          <Link href={CLASH_YAML_CONFIG_DOCS_URL} target={"_blank"}>
            {t(TRANSLATION_KEY.HOW_TO_CONFIG)}
          </Link>
        </span>
        )
      </div>
      <Textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
        textarea={{ className: styles.textarea }}
        className={styles.input}
        autoFocus
        resize={"vertical"}
      />
      <div className={styles.buttonContainer}>
        <Button onClick={close} className={styles.button}>
          {t(TRANSLATION_KEY.FORM_CANCEL)}
        </Button>
        <Button
          className={styles.button}
          disabled={!isValid || loading}
          onClick={handleConfirm}
          appearance="primary"
        >
          {loading && <Spinner size="extra-tiny" className={styles.spinner} />}
          {t(TRANSLATION_KEY.FORM_SAVE)}
        </Button>
      </div>
    </div>
  );
}

export default ProxyYamlModal;
