import React, { lazy } from 'react'
import { useSelector } from 'react-redux'

import selectors from '../../store/selectors'
import Suspense from '../system/Suspense'

const EditButton = lazy(() => import(/* webpackChunkName: "ui" */ '../buttons/EditButton'))

const RenderRoot = ({
  content,
  editor,
}) => {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {
        editor && (
          <div 
            style={{
              flexGrow: 0,
              marginRight: '20px',
            }}
          >
            { editor }
          </div>
        )
      }
      <div 
        style={{
          flexGrow: 1,
        }}
      >
        { content }
      </div>
    </div>
  )
}

const RenderContent = ({
  value,
}) => {
  return value
}

const RenderHTML = ({
  value,
}) => {
  return (
    <span dangerouslySetInnerHTML={{__html: value}}>
    </span>
  )
}

const defaultRenderers = {
  root: RenderRoot,
  content: RenderContent,
  html: RenderHTML,
}

const SettingsWidget = ({
  renderers = {},
  getValue,
  html,
}) => {
  const settings = useSelector(selectors.ui.settings)

  const RootRenderer = renderers.root || defaultRenderers.root
  let ContentRenderer = defaultRenderers.content

  if(renderers.content) ContentRenderer = renderers.content
  else if(html) ContentRenderer = defaultRenderers.html

  const value = getValue ? getValue(settings) : null

  const editor = (
    <Suspense>
      <EditButton 
        id="settings"
        driver="local"
        type="settings"
        location="singleton:settings"
        tiny
      />
    </Suspense>
  )

  const content = (
    <ContentRenderer
      settings={ settings }
      value={ value }
    />
  )

  return (
    <RootRenderer
      content={ content }
      editor={ editor }
    />
  )
}

export default SettingsWidget