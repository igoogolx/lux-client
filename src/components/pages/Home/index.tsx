import * as React from 'react'
import { Header } from './Header'
import styles from './index.module.css'
import { Content } from './Content'

export default function Home (): React.ReactNode {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.content}>
        <Content />
      </div>
    </div>
  )
}
