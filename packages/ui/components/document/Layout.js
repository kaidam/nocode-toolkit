import React, { lazy, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Suspense from '../system/Suspense'
import Layout from '../layout/Layout'
import FolderLayout from '../layout/FolderLayout'
import selectors from '../../store/selectors'

const RenderDefaultHomeUI = lazy(() => import(/* webpackChunkName: "ui" */ './RenderDefaultHomeUI'))
const CellOptions = lazy(() => import(/* webpackChunkName: "ui" */ './CellOptions'))
const PageSettingsButton = lazy(() => import(/* webpackChunkName: "ui" */ './PageSettingsButton'))
const DocumentReloadTrigger = lazy(() => import(/* webpackChunkName: "ui" */ './DocumentReloadTrigger'))

const RenderDefaultHome = ({
  children,
}) => {
  return (
    <div
      style={{
        fontFamily: 'Roboto'
      }}
    >
      <h3>Welcome to your new website!</h3>
      { children }
    </div>
  )
}

const defaultRenderers = {
  defaultHome: RenderDefaultHome,
}

const DocumentRouteLayout = ({
  data,
  renderers = {},
}) => {
  const renderCell = ({
    data,
    cell,
  }) => {
    if(data.defaultHome && cell.mainDocumentContent) {
      const RenderComponent = renderers.defaultHome || defaultRenderers.defaultHome
      return (
        <RenderComponent>
          <Suspense>
            <RenderDefaultHomeUI />
          </Suspense>
        </RenderComponent> 
      )
    }
    else {
      return null
    }
  }

  return (
    <React.Fragment>
      <Suspense>
        <PageSettingsButton
          item={ data.item }
        />
      </Suspense>
      <Layout
        renderers={ renderers }
        data={ data }
        renderCell={ renderCell }
        CellOptionsWrapper={ CellOptions }
      />
      <Suspense>
        <PageSettingsButton
          item={ data.item }
        />
      </Suspense>
      <Suspense>
        <DocumentReloadTrigger />
      </Suspense>
    </React.Fragment>
  )
}

const FolderRouteLayout = ({
  data,
  renderers = {},
}) => {
  return (
    <FolderLayout
      data={ data }
      renderers={ renderers }
    />
  )
}

const RouteLayout = ({
  renderers = {},
}) => {

  const data = useSelector(selectors.document.data)

  if(data.type == 'document') {
    return (
      <DocumentRouteLayout
        renderers={ renderers }
        data={ data }
      />
    )
  }
  else if(data.type == 'folder') {
    return (
      <FolderRouteLayout
        renderers={ renderers }
        data={ data }
      />
    )
  }
  else {
    return (
      <div>Unknown item found { data.type }</div>
    )
  }
}

export default RouteLayout
