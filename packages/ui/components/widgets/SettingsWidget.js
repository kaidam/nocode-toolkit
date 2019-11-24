import React from 'react'
import { useSelector } from 'react-redux'

import selectors from '../../store/selectors'
import EditWidget from './EditWidget'

const SettingsWidget = ({
  getValue,
  htmlMode,
  renderers,
}) => {
  const settings = useSelector(selectors.ui.settings)
  const settingsData = settings.data || {}
  const value = getValue ? getValue(settingsData) : settingsData
  return (
    <EditWidget
      id="settings"
      type="settings"
      location="singleton:settings"
      value={ value }
      htmlMode={ htmlMode }
      renderers={ renderers }
    />
  )
}

export default SettingsWidget