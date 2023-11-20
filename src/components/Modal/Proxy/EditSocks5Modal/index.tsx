import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { addProxy, ProxyTypeEnum, type Socks5, updateProxy } from 'lux-js-sdk'
import { Button } from '@fluentui/react-components'
import { MAX_PORT, MIN_PORT } from '@/utils/validator'
import { TRANSLATION_KEY } from '@/i18n/locales/key'
import { proxiesSlice, type RootState } from '@/reducers'
import { Field, Form } from '../../../Core'
import styles from './index.module.css'

interface EditSocks5ModalProps {
  close: () => void
  initialValue?: Socks5
  isSelected?: boolean
}

const INIT_DATA: Socks5 = {
  type: ProxyTypeEnum.Socks5,
  server: '',
  id: '',
  name: '',
  port: 1080,
  password: '',
  username: ''
}

const Socks5Schema = Yup.object().shape({
  name: Yup.string(),
  server: Yup.string().required('Required'),
  port: Yup.number().min(MIN_PORT).max(MAX_PORT).required('Required'),
  username: Yup.string(),
  password: Yup.string()
})

export function EditSocks5Modal (props: EditSocks5ModalProps) {
  const { t } = useTranslation()
  const { close, initialValue, isSelected } = props
  const dispatch = useDispatch()
  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared
  )
  const onSubmit = async (data: Socks5) => {
    if (initialValue) {
      await updateProxy({
        id: data.id,
        proxy: data
      })
      dispatch(proxiesSlice.actions.updateOne({ proxy: data }))
    } else {
      const { id } = await addProxy({
        proxy: data
      })
      dispatch(proxiesSlice.actions.addOne({ proxy: { ...data, id } }))
    }
    close()
  }

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValue || INIT_DATA}
      validationSchema={Socks5Schema}
    >
      {({ isValid, submitForm }) => {
        return (
          <>
            <Field<keyof Socks5>
              name="name"
              label={t(TRANSLATION_KEY.FORM_NAME)}
            />
            <Field<keyof Socks5>
              name="server"
              label={t(TRANSLATION_KEY.FORM_SERVER)}
            />
            <Field<keyof Socks5>
              name="port"
              label={t(TRANSLATION_KEY.FORM_PORT)}
              type="number"
            />
            <Field<keyof Socks5>
              name="username"
              label={`${t(TRANSLATION_KEY.FORM_PASSWORD)}(${t(
                TRANSLATION_KEY.FORM_OPTIONAL
              )})`}
            />
            <Field<keyof Socks5>
              name="password"
              label={`${t(TRANSLATION_KEY.FORM_USERNAME)}(${t(
                TRANSLATION_KEY.FORM_OPTIONAL
              )})`}
            />
            <div className={styles.buttonContainer}>
              <Button onClick={close} className={styles.button}>
                {t(TRANSLATION_KEY.FORM_CANCEL)}
              </Button>
              <Button
                className={styles.button}
                disabled={!isValid || (isSelected && isStarted)}
                onClick={submitForm}
                appearance="primary"
              >
                {t(TRANSLATION_KEY.FORM_SAVE)}
              </Button>
            </div>
          </>
        )
      }}
    </Form>
  )
}
