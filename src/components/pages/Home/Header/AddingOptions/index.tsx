import React, { useState } from 'react'
import { addProxy, type BaseProxy, ProxyTypeEnum } from 'lux-js-sdk'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { parse as parseYaml } from 'yaml'
import {
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger
} from '@fluentui/react-components'
import { AddFilled } from '@fluentui/react-icons'
import { proxiesSlice } from '@/reducers'
import { decode } from '@/utils/url'
import { TRANSLATION_KEY } from '@/i18n/locales/key'
import { EditModal } from '../../../../Modal/Proxy'
import SubscriptionUrlModal from '../../../../Modal/SubscriptionUrlModalProps'

enum OperationTypeEnum {
  Shadowsocks,
  Socks5,
  Clipboard,
  Http,
  SubscriptionUrl,
}

interface AddingOptionsProps {
  className?: string
}

export function AddingOptions (props: AddingOptionsProps): React.ReactNode {
  const { className } = props
  const { t } = useTranslation()
  const [currentAddingType, setCurrentAddingType] =
    useState<ProxyTypeEnum | null>(null)
  const dispatch = useDispatch()

  const [isOpenSubscriptionUrlModal, setIsOpenSubscriptionUrlModal] = useState(false)

  const closeAddingModal = () => {
    setCurrentAddingType(null)
  }

  const items = [
    {
      id: OperationTypeEnum.Shadowsocks,
      content: t(TRANSLATION_KEY.SHADOWSOCKS)
    },
    { id: OperationTypeEnum.Socks5, content: t(TRANSLATION_KEY.SOCKS5) },
    {
      id: OperationTypeEnum.Http,
      content: t(TRANSLATION_KEY.HTTP)
    },
    {
      id: OperationTypeEnum.Clipboard,
      content: t(TRANSLATION_KEY.CLIPBOARD_IMPORT)
    },
    {
      id: OperationTypeEnum.SubscriptionUrl,
      content: t(TRANSLATION_KEY.SUBSCRIPTION_URL_IMPORT)
    }
  ]

  const onSelect = async (id: OperationTypeEnum) => {
    switch (id) {
      case OperationTypeEnum.Shadowsocks:
        setCurrentAddingType(ProxyTypeEnum.Shadowsocks)
        break
      case OperationTypeEnum.Socks5:
        setCurrentAddingType(ProxyTypeEnum.Socks5)
        break
      case OperationTypeEnum.Http:
        setCurrentAddingType(ProxyTypeEnum.Http)
        break
      case OperationTypeEnum.Clipboard: {
        const url = await navigator.clipboard.readText()
        const proxyConfigs = decode(url)
        await Promise.all(
          proxyConfigs.map(async (proxyConfig) => {
            const proxy = { ...proxyConfig }
            const res = await addProxy({ proxy })
            dispatch(
              proxiesSlice.actions.addOne({ proxy: { ...proxy, id: res.id } })
            )
          })
        )
        break
      }
      case OperationTypeEnum.SubscriptionUrl: {
        setIsOpenSubscriptionUrlModal(true)
        break
      }
      default: {
        throw new Error('invalid id')
      }
    }
  }

  return (
    <div className={className}>
      {isOpenSubscriptionUrlModal && (
        <SubscriptionUrlModal
          close={() => {
            setIsOpenSubscriptionUrlModal(false)
          }}
        />
      )}
      {(currentAddingType != null) && (
        <EditModal close={closeAddingModal} type={currentAddingType} />
      )}
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <Button icon={<AddFilled />} />
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            {items.map((item) => (
              <MenuItem
                key={item.id}
                onClick={() => {
                  onSelect(item.id as OperationTypeEnum)
                }}
              >
                {item.content}
              </MenuItem>
            ))}
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  )
}
