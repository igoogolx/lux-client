import React from 'react'
import { CopyRegular } from '@fluentui/react-icons'
import { Button } from '@fluentui/react-components'
import styles from './index.module.css'
import { useClipboard } from '@/utils/clipboard'

interface CodeBlockProps {
  text: string
}

export default function CodeBlock (props: CodeBlockProps) {
  const { text } = props

  const { copy } = useClipboard()

  return (
    <article className={styles.container}>
      <Button
        icon={<CopyRegular />}
        className={styles.btn}
        onClick={async () => { await copy(text.replace(/\n/g, '&&')) }}
      />
      <pre>
        <code>{text}</code>
      </pre>
    </article>
  )
}
