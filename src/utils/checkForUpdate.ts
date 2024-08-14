import axios from 'axios'
import { compare } from 'semver'
import { getVersion } from './version'

function compareVersion (current: string, latest: string): boolean {
  return compare(latest, current) === 1
}

function getVersionFromTag (tag: string) {
  return tag.slice(1)
}

export default async function checkForUpdate (): Promise<boolean> {
  const currenVersion = getVersion()
  if (!currenVersion) {
    return false
  }
  const res = await axios.create().get(
    'https://api.github.com/repos/igoogolx/lux/releases/latest'
  )
  const latestVersion = getVersionFromTag(res.data.tag_name as string)
  return compareVersion(currenVersion, latestVersion)
}
