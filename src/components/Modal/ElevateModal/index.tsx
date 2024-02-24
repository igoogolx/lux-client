import { useSelector } from 'react-redux'
import React, { type ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getExecutablePath, getRuntimeOS } from 'lux-js-sdk'
import { TRANSLATION_KEY } from '@/i18n/locales/key'
import { type RootState } from '@/reducers'
import { ConfirmModal } from '../../Core'
import CodeBlock from '../../Core/CodeBlock'

const CORE_PATH_VAR = 'LUX_CORE_PATH'

export function ElevateModal (): ReactNode {
  const { t } = useTranslation()

  const [os, setOs] = useState('')
  useEffect(() => {
    getRuntimeOS().then((res) => {
      setOs(res.os)
    })
  }, [])

  const isAdmin = useSelector<RootState, boolean>(
    (state) => state.general.isAdmin
  )
  const [corePath, setCorePath] = useState('')

  useEffect(() => {
    getExecutablePath().then((path) => {
      setCorePath(path)
    })
  }, [])

  const isDarwin = os === 'darwin'

  return !isAdmin
    ? (
    <ConfirmModal
      title={t(TRANSLATION_KEY.ELEVATE_CORE)}
      content={
        <div>
          <div>{t(isDarwin ? TRANSLATION_KEY.ELEVATE_TIP_MACOS : TRANSLATION_KEY.ELEVATE_TIP_WINDOWS)}</div>
          {
              isDarwin &&
              <CodeBlock
                  text={`export ${CORE_PATH_VAR}=${corePath}\nsudo chown root:wheel $${CORE_PATH_VAR}\nsudo chmod 770 $${CORE_PATH_VAR}\nsudo chmod +sx $${CORE_PATH_VAR}`}
              />
          }

        </div>
      }
    />
      )
    : (
        ''
      )
}
