import React, { lazy, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Suspense from '../system/Suspense'
import Layout from '../layout/Layout'
import selectors from '../../store/selectors'

const RenderDefaultHomeUI = lazy(() => import(/* webpackChunkName: "ui" */ './RenderDefaultHomeUI'))
const CellOptions = lazy(() => import(/* webpackChunkName: "ui" */ './CellOptions'))
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

const DocumentLayout = ({
  renderers = {},
}) => {

  const data = useSelector(selectors.document.data)

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
      <Layout
        renderers={ renderers }
        data={ data }
        renderCell={ renderCell }
        CellOptionsWrapper={ CellOptions }
      />
      <Suspense>
        <DocumentReloadTrigger />
      </Suspense>
    </React.Fragment>
    
  )
}

export default DocumentLayout
