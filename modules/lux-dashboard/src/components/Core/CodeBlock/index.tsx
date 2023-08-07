import React from "react";
import styles from "./index.module.css";
import { CopyRegular } from "@fluentui/react-icons";
import { Button } from "@fluentui/react-components";

type CodeBlockProps = {
  text: string
}

export default function CodeBlock(props: CodeBlockProps) {
  const { text } = props;

  return <article className={styles.container}>
    <Button icon={<CopyRegular />} className={styles.btn} onClick={async () => {
      await navigator.clipboard.writeText(text);
    }} />
    <pre>
    <code>
      {text}
    </code>
    </pre>
  </article>;
}
