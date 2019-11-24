import React, { lazy } from 'react'
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

const EditWidget = ({
  id,
  driver = 'local',
  type,
  location,
  value,
  htmlMode,
  renderers = {},
}) => {
  const RootRenderer = renderers.root || defaultRenderers.root
  const ContentRenderer = renderers.content ?
    renderers.content
    : htmlMode ? defaultRenderers.html : defaultRenderers.content

  const editor = (
    <Suspense>
      <EditButton 
        id={ id }
        driver={ driver }
        type={ type }
        location={ location }
        tiny
      />
    </Suspense>
  )

  const content = (
    <ContentRenderer
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

export default EditWidget