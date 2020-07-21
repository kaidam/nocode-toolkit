import deepmerge from 'deepmerge'
import library from '../library'
import formUtils from '../components/form/utils'

const canEdit = (widget) => {
  if(!widget) return false
  if(widget.form) return true
  if(widget.settingsGroup) return true
  return false
}

const getFormTabs = ({
  widget,
  settingsTabs,
}) => {
  let baseTabs = []

  // this widget works with global settings data
  if(widget.settingsGroup) {
    const flatSchema = formUtils.flattenTabs(settingsTabs)
    const filteredSchema = flatSchema.filter(item => item.groups && item.groups.indexOf(widget.settingsGroup) >= 0 ? true : false)
    baseTabs = [{
      id: 'data',
      title: widget.title,
      schema: filteredSchema,
    }]
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
      settings: cell.data.settings,
    })
  }
  else {
    return cell.data
  }
}

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
  getFormTabs,
  getFormData,
  getWebsiteSettingsValue,
  getCellDataValue,
}

export default utils