import deepmerge from 'deepmerge'
import library from '../library'
import formUtils from '../components/form/utils'

const canEdit = (widget) => {
  if(!widget) return false
  if(widget.form) return true
  if(widget.settingsGroup) return true
  return false
}

const filterSettingsTabs = ({
  settingsTabs,
  title = 'Data',
  group,
}) => {
  const flatSchema = formUtils.flattenTabs(settingsTabs)
  const filteredSchema = flatSchema.filter(item => item.groups && item.groups.indexOf(group) >= 0 ? true : false)
  return [{
    id: 'data',
    title,
    schema: filteredSchema,
  }]
}

const getFormTabs = ({
  widget,
  settingsTabs,
}) => {
  let baseTabs = []

  // this widget works with global settings data
  if(widget.settingsGroup) {
    baseTabs = filterSettingsTabs({
      settingsTabs,
      group: widget.settingsGroup,
    })
  }
  else if(widget.form) {
    baseTabs = widget.form || []
  }
  return baseTabs.concat(library.forms['cell.settings'].tabs)
}

const getFormData = ({
  widget,
  settings,
  cell,
}) => {
  if(widget.settingsGroup) {
    return Object.assign({}, settings, {
      settings: cell ? (cell.data.settings || {}) : {},
    })
  }
  else {
    return cell ? cell.data : {}
  }
}

const mergeSettings = ({
  data,
  settings,
}) => deepmerge(JSON.parse(JSON.stringify(settings)), data)

const getWebsiteSettingsValue = ({
  widget,
  data,
  settings,
}) => {
  if(!widget.settingsGroup) return null
  const newSettings = Object.assign({}, data)
  delete(newSettings.settings)
  return deepmerge(settings, newSettings)
}

const getCellDataValue = ({
  widget,
  data,
}) => {
  if(!widget.settingsGroup) return data
  return {
    settings: data.settings || {},
  }
}

const utils = {
  canEdit,
  filterSettingsTabs,
  getFormTabs,
  getFormData,
  getWebsiteSettingsValue,
  getCellDataValue,
  mergeSettings,
}

export default utils