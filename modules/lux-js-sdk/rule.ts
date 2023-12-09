import axios from 'axios'
import { type AddCustomizedRules, type DeleteCustomizedRules, type GetRuleDetail, type GetRules } from './types'
import { urtConfig } from './url'

export const getRules: GetRules = async () => {
  const url = `${urtConfig.rule}`
  const res = await axios.get(url)
  res.data.rules = res.data.rules.map((str: string) => ({
    id: str,
    value: str
  }))
  return res.data
}

export const getRuleDetail: GetRuleDetail = async (id: string) => {
  const url = `${urtConfig.rule}/${id}`
  const res = await axios.get(url)
  return res.data
}

export const addCustomizedRules: AddCustomizedRules = async (rules) => {
  const url = `${urtConfig.rule}/customized`
  await axios.post(url, { rules })
}

export const deleteCustomizedRules: DeleteCustomizedRules = async (rules) => {
  const url = `${urtConfig.rule}/customized`
  await axios.delete(url, { data: { rules } })
}
