import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  addProxiesFromClashUrlConfig
} from 'lux-js-sdk'
import { useDispatch } from 'react-redux'
import { Textarea } from '@fluentui/react-components'
import { proxiesSlice } from '@/reducers'
import { TRANSLATION_KEY } from '@/i18n/locales/key'
import { Modal, notifier } from '../../Core'
import styles from './index.module.css'

interface ClashConfigUrlModalProps {
  close: () => void
}

function ClashConfigUrlModal (props: ClashConfigUrlModalProps) {
  const { close } = props
  const { t } = useTranslation()
  const [destination, setDestination] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const handleConfirm = async () => {
    try {
      setLoading(true)
      if (destination) {
        const res = await addProxiesFromClashUrlConfig({ url: destination })
        dispatch(proxiesSlice.actions.received(res))
      }
      close()
      notifier.success(t(TRANSLATION_KEY.UPDATE_SUCCESS))
    } finally {
      setLoading(false)
    }
  }
  return (
    <Modal close={close} onOk={handleConfirm} loadingOk={loading}>
      <div className={styles.search}>
        <Textarea
          value={destination}
          onChange={(e) => {
            setDestination(e.target.value.trim())
          }}
          className={styles.input}
          placeholder={t(TRANSLATION_KEY.CLASH_URL)}
          autoFocus
        />
      </div>
    </Modal>
  )
}

export default ClashConfigUrlModal
