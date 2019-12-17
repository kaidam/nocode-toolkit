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

const defaultRenderers = {
  root: RenderRoot,
}

const ContentEditor = ({
  id,
  driver = 'local',
  type,
  location,
  renderers = {},
  children,
}) => {

  const showUI = useSelector(selectors.ui.showUI)
  const RootRenderer = renderers.root || defaultRenderers.root
  
  const editor = showUI && (
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

  return (
    <RootRenderer
      content={ children }
      editor={ editor }
    />
  )
}

export default ContentEditor