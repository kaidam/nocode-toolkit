import React, { lazy } from 'react'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'

import systemSelectors from '../../store/selectors/system'
import settingsSelectors from '../../store/selectors/settings'

import Snippet from './Snippet'
import Suspense from './Suspense'

const EditorTopbar = lazy(() => import(/* webpackChunkName: "ui" */ './EditorTopbar'))
const DialogLoader = lazy(() => import(/* webpackChunkName: "ui" */ '../dialog/Loader'))

const Layout = ({
  children,
  material = false,
}) => {

  const showUI = useSelector(systemSelectors.showUI)
  const settings = useSelector(settingsSelectors.settings)

  const snippets = {
    head: useSelector(settingsSelectors.headSnippetCode),
    before: useSelector(settingsSelectors.beforeBodySnippetCode),
    after: useSelector(settingsSelectors.afterBodySnippetCode),
  }
  
  return (
    <React.Fragment>
      <Helmet
        title={ settings.title || 'Nocode Website' } 
      > 
        <meta name="description" content={ settings.description } />
        <meta name="keywords" content={ settings.keywords } />
        <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="user-scalable=0, initial-scale=1, minimum-scale=1, width=device-width, height=device-height" />
        <link rel="shortcut icon" href="images/favicon.png" />
        {
          (material || showUI) && <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
        }
        {
          (material || showUI) && <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        }
      </Helmet>
      <Snippet
        head
        html={ snippets.head }
      />
      <Suspense
        Component={ EditorTopbar }
      />
      <Snippet
        html={ snippets.before }
      />
      { children }
      <Snippet
        html={ snippets.after }
      />
      <Suspense
        Component={ DialogLoader }
      />
    </React.Fragment>
  )
}

export default Layout
