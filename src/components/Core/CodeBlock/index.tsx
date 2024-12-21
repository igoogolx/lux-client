import { useClipboard } from "@/utils/clipboard";
import { Button } from "@fluentui/react-components";
import { CopyRegular } from "@fluentui/react-icons";
import React from "react";
import styles from "./index.module.css";

interface CodeBlockProps {
  text: string;
}

export default function CodeBlock(props: CodeBlockProps) {
  const { text } = props;

  const { copy } = useClipboard();

  return (
    <article className={styles.container}>
      <Button
        icon={<CopyRegular />}
        className={styles.btn}
        onClick={async () => {
          await copy(text.replace(/\n/g, "&&"));
        }}
      />
      <pre>
        <code>{text}</code>
      </pre>
    </article>
  );
}
