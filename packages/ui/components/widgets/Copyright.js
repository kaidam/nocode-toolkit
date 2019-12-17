import React from 'react'
import ContentEditor from './ContentEditor'
import useSettings from '../hooks/useSettings'

const getValue = (settings) => {
  const copyright_message = settings.copyright_message || '&copy; &year; My Company Name'
  const copyrightMessage = (copyright_message || '').replace(/\&year;?/, () => new Date().getFullYear())
  return copyrightMessage
}

const DefaultRenderer = ({
  value,
  ...props
}) => {
  return (
    <span dangerouslySetInnerHTML={{__html: value}}>
    </span>
  )
}

const Copyright = ({
  renderers,
  ...props
}) => {
  const settings = useSettings()
  const Renderer = renderers.content || DefaultRenderer

  return (
    <ContentEditor
      id="settings"
      type="settings"
      location="singleton:settings"
      renderers={ renderers }
      props={ props }
    >
      <Renderer
        value={ getValue(settings) }
        {...props}
      />
    </ContentEditor>
  )
}

export default Copyright