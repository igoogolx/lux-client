import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getSetting } from 'lux-js-sdk'
import enUS from './locales/en_us'
import zhCN from './locales/zh_cn'

enum I18nLang {
  EN_US = 'en-US',
  ZH_CN = 'zh-CN',
}

export function getLang (value?: string) {
  if (value === I18nLang.EN_US || value === I18nLang.ZH_CN) {
    return value
  }
  return I18nLang.EN_US
}

async function initLanguage (language?: string) {
  return await i18n.use(initReactI18next).init({
    lng: getLang(language),
    debug: process.env.NODE_ENV === 'development',
    returnObjects: true,
    resources: {
      [I18nLang.EN_US]: {
        translation: enUS
      },
      [I18nLang.ZH_CN]: {
        translation: zhCN
      }
    }
  })
}

export async function initI18n () {
  await initLanguage()
  getSetting().then((setting) => {
    i18n.changeLanguage(getLang(setting.language))
  })
}
