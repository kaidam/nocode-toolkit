import React from 'react'
import SettingsWidget from './SettingsWidget'

const getValue = (settings) => {
  const copyright_message = settings.data.copyright_message || '&copy; &year; My Company Name'
  const copyrightMessage = (copyright_message || '').replace(/\&year;?/, () => new Date().getFullYear())
  return copyrightMessage
}

const Copyright = ({

}) => {
  return (
    <SettingsWidget
      getValue={ getValue }
      html
    />
  )
}

export default Copyright