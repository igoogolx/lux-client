import React, { useEffect } from 'react'
import {
  Toast,
  Toaster,
  ToastTitle,
  useId,
  useToastController
} from '@fluentui/react-components'
import { type NotificationAction } from './reducer'
import { createEventManager } from './util'

export const notificationEventManager =
  createEventManager<NotificationAction>()

export function NotificationContainer () {
  const toasterId = useId('toaster')
  const { dispatchToast } = useToastController(toasterId)

  useEffect(() => {
    notificationEventManager.on((data) => {
      dispatchToast(
        <Toast>
          <ToastTitle>{data.title}</ToastTitle>
        </Toast>,
        { intent: data.type, position: 'top', pauseOnHover: true }
      )
    })
    return () => {
      notificationEventManager.remove()
    }
  }, [dispatchToast])

  return <Toaster toasterId={toasterId} />
}
