import React, { useState } from 'react'
import { Button, Caption1, mergeClasses, Subtitle2 } from '@fluentui/react-components'
import { useSelector } from 'react-redux'
import { type RootState } from '@/reducers'
import styles from '../../index.module.css'
import { TRANSLATION_KEY } from '@/i18n/locales/key'
import { useTranslation } from 'react-i18next'
import AddDnsOptionModal from '@/components/Modal/AddDnsOptionModal'

export default function AddDnsOption () {
  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared || state.manager.isLoading
  )
  const { t } = useTranslation()
  const [isOpenConfigModal, setIsOpenConfigModal] = useState(false)
  return (
    <div className={styles.cardItem}>
        {
            isOpenConfigModal && <AddDnsOptionModal id={''} />
        }
      <div className={styles.desc}>
        {
          <Subtitle2>{'Customized Options'}</Subtitle2>
        }
        <Caption1>{'add your dns options'}</Caption1>
      </div>
      <div>
        <Button
            onClick={() => {
              setIsOpenConfigModal(true)
            }}
            className={mergeClasses(
              styles.actionBtn
            )}
            disabled={isStarted}
        >
          {t(TRANSLATION_KEY.FORM_RESET)}
        </Button>
      </div>
    </div>
  )
}
