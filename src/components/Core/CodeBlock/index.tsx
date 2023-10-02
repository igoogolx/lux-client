import React from "react";
import { CopyRegular } from "@fluentui/react-icons";
import { Button } from "@fluentui/react-components";
import { notifier } from "@/components/Core";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";

type CodeBlockProps = {
  text: string;
};

export default function CodeBlock(props: CodeBlockProps) {
  const { text } = props;
  const { t } = useTranslation();

  return (
    <article className={styles.container}>
      <Button
        icon={<CopyRegular />}
        className={styles.btn}
        onClick={async () => {
          await navigator.clipboard.writeText(text.replace("\n", "&&"));
          notifier.success(t(TRANSLATION_KEY.COPIED));
        }}
      />
      <pre>
        <code>{text}</code>
      </pre>
    </article>
  );
}
