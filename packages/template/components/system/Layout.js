import React, { lazy } from 'react'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { withStyles } from '@material-ui/core/styles'

import systemSelectors from '../../store/selectors/system'
import settingsSelectors from '../../store/selectors/settings'

import Snippet from './Snippet'
import Suspense from './Suspense'

const GlobalCss = withStyles({
  // @global is handled by jss-plugin-global.
  '@global': {
    // You should target [class*="MuiButton-root"] instead if you nest themes.
    '.MuiBackdrop-root': {
        backdropFilter: 'blur(10px)',
    },
  },
})(() => null);

const GlobalSettings = lazy(() => import(/* webpackChunkName: "ui" */ './GlobalSettings'))
const DialogLoader = lazy(() => import(/* webpackChunkName: "ui" */ '../dialog/Loader'))

const Layout = ({
  children,
  head,
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
        <meta name="format-detection" content="telephone=no"></meta>
        <meta name="viewport" content="user-scalable=0, initial-scale=1, minimum-scale=1, width=device-width, height=device-height" />
        <link rel="shortcut icon" href="images/favicon.png" />
        {
          (material || showUI) && <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
        }
        {
          (material || showUI) && <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        }
        {
          head
        }
      </Helmet>
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
        Component={ GlobalSettings }
      />
      <GlobalCss />
    </React.Fragment>
  )
}

export default Layout