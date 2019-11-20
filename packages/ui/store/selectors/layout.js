import core from '@nocode-toolkit/website/selectors'

const settings = state => {
  const settingsItem = core.nocode.item(state, 'content', 'settings') || {}
  return settingsItem ? (settingsItem.data || {}) : {}
}

const logo = state => {
  const logoItem = core.nocode.item(state, 'content', 'logo') || {}
  return logoItem ? (logoItem.data || {}) : {}
}

const selectors = {
  settings,
  logo,
}

export default selectors
