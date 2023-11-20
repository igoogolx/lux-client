import React from 'react'
import styles from './index.module.css'
import { Modal } from '../Modal'

export interface ConfirmModalPros {
  title: string
  content: React.ReactNode
  cancelText?: string
  confirmText?: string
  onCancel?: () => void
  onConfirm?: () => void
  hideCancelText?: boolean
  hideConfirmText?: boolean
  loading?: boolean
}

export function ConfirmModal (props: ConfirmModalPros) {
  const {
    title,
    content,
    onCancel,
    onConfirm,
    cancelText,
    confirmText,
    loading = false,
    hideCancelText = false,
    hideConfirmText = false
  } = props

  return (
    <Modal
      close={onCancel}
      hideCloseButton={hideCancelText}
      hideOkButton={hideConfirmText}
      loadingOk={loading}
      closeText={cancelText}
      okText={confirmText}
      onOk={onConfirm}
    >
      <div className={styles.container}>
        <div className={styles.title}>{title}</div>
        <div className={styles.content}>{content}</div>
      </div>
    </Modal>
  )
}
