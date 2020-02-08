import React, { lazy } from 'react'
import { useSelector } from 'react-redux'
import UserHTML from './UserHTML'
import selectors from '../../store/selectors'

import Snackbar from './Snackbar'
import UILoader from './UILoader'
import Header from './Header'

const NocodeTopbar = lazy(() => import(/* webpackChunkName: "ui" */ './NocodeTopbar'))
const UIElements = lazy(() => import(/* webpackChunkName: "ui" */ '@nocode-toolkit/ui/components/system/UIElements'))

const AppLayout = ({
  children,
}) => {

  const showUI = useSelector(selectors.ui.showUI)
  const beforeBodySnippetHTML = useSelector(selectors.ui.beforeBodySnippetCode)
  const afterBodySnippetHTML = useSelector(selectors.ui.afterBodySnippetCode)

  return (
    <React.Fragment>
      <Header />
      <UILoader
        Component={ NocodeTopbar }
      />
      <UserHTML
        html={ beforeBodySnippetHTML }
      />
      { children }
      <UserHTML
        html={ afterBodySnippetHTML }
      />
      {
        !showUI && (
          <Snackbar />
        )
      }
      <UILoader
        Component={ UIElements }
      />
    </React.Fragment>
    
  )
}

export default AppLayout
