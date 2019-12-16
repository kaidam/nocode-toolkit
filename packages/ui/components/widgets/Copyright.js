import React from 'react'
import SettingsWidget from './SettingsWidget'

const getValue = (settings, props) => {
  const copyright_message = settings.copyright_message || '&copy; &year; My Company Name'
  const copyrightMessage = (copyright_message || '').replace(/\&year;?/, () => new Date().getFullYear())
  return copyrightMessage
}

const Copyright = ({
  renderers,
  ...props
}) => {
  return (
    <SettingsWidget
      htmlMode
      getValue={ getValue }
      renderers={ renderers }
      props={ props }
    />
  )
}

export default Copyright