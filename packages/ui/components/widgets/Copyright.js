import React from 'react'
import SettingsWidget from './SettingsWidget'

const RenderContent = ({
  settings,
}) => {
  const copyright_message = settings.data.copyright_message || '&copy; &year; My Company Name'
  const copyrightMessage = (copyright_message || '').replace(/\&year;?/, () => new Date().getFullYear())
  return (
    <span dangerouslySetInnerHTML={{__html: copyrightMessage}}>
    </span>
  )
}

const renderers = {
  content: RenderContent,
}

const Copyright = ({

}) => {
  return (
    <SettingsWidget
      renderers={ renderers }
    />
  )
}

export default Copyright