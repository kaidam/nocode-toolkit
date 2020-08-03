import React, { lazy } from 'react'
import { useSelector } from 'react-redux'

import Header from './Header'

import systemSelectors from '../../store/selectors/system'
import settingsSelectors from '../../store/selectors/settings'
import documentSelectors from '../../store/selectors/document'

import Snippet from './Snippet'
import Suspense from './Suspense'

const GlobalCss = lazy(() => import(/* webpackChunkName: "ui" */ './GlobalCss'))
const DialogLoader = lazy(() => import(/* webpackChunkName: "ui" */ '../dialog/Loader'))

const Layout = ({
  children,
  head,
  favicon,
  titleField = 'company_name',
  material = false,
}) => {

  const showUI = useSelector(systemSelectors.showUI)
  const settings = useSelector(settingsSelectors.settings)
  const cssImports = useSelector(documentSelectors.cssImports)

  const snippets = {
    head: useSelector(settingsSelectors.headSnippetCode),
    before: useSelector(settingsSelectors.beforeBodySnippetCode),
    after: useSelector(settingsSelectors.afterBodySnippetCode),
  }

  favicon = favicon || 'images/favicon.png'

  return (
    <React.Fragment>
      <Header
        title={ settings[titleField] || 'Nocode Website' } 
      > 
        <meta name="description" content={ settings.description } />
        <meta name="keywords" content={ settings.keywords } />
        <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
        <meta name="format-detection" content="telephone=no"></meta>
        <meta name="viewport" content="user-scalable=0, initial-scale=1, minimum-scale=1, width=device-width, height=device-height" />
        <link rel="shortcut icon" href={ favicon } />
        {
          (material || showUI) && <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
        }
        {
          (material || showUI) && <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        }
        {
          // render the various CSS imports found in document HTML
          Object.keys(cssImports).map((cssImport) => {
            return (
              <link key={ cssImport } rel="stylesheet" href={ cssImport } />
            )
          })
        }
        {
          head
        }
      </Header>
      <Snippet
        head
        html={ snippets.head }
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
      <Suspense
        coreEnabled
        Component={ GlobalCss }
      />
    </React.Fragment>
  )
}

export default Layout