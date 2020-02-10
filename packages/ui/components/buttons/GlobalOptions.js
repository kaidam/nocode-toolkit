import React, { useMemo, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import Hidden from '@material-ui/core/Hidden'
import Actions from '../../utils/actions'
import selectors from '../../store/selectors'
import uiActions from '../../store/modules/ui'
import jobActions from '../../store/modules/job'
import icons from '../../icons'

import MenuButton from './MenuButton'

const onListWebsites = () => document.location = '/'

const useStyles = makeStyles(theme => ({
  logoLink: {
    cursor: 'pointer',
  },
  logo: {
    height: `${theme.layout.uiLogoHeight}px`,
    padding: '3px',
  },
}))

const GlobalOptions = ({

}) => {

  const classes = useStyles()

  const actions = Actions(useDispatch(), {
    onOpenSettings: uiActions.openSettings,
    onSetPreviewMode: uiActions.setPreviewMode,
    onLogout: uiActions.logout,
    onRebuild: jobActions.rebuild,
    onPublish: jobActions.publish,
    onViewHistory: jobActions.openHistory,
    onViewHelp: uiActions.openHelp,
  })

  const previewMode = useSelector(selectors.ui.previewMode)

  const getMenuItems = useCallback(
    (includeExtra) => {
      return [{
        title: 'Settings',
        icon: icons.settings,
        handler: actions.onOpenSettings,
      }, {
        title: 'Build Website',
        icon: icons.build,
        handler: actions.onPublish,
      }, {
        title: 'Build History',
        icon: icons.history,
        handler: actions.onViewHistory,
      }, 
      includeExtra ? {
        title: 'Reload',
        icon: icons.refresh,
        handler: actions.onRebuild,
      } : null,
      includeExtra && !previewMode ? {
        title: 'Enable Preview',
        icon: icons.look,
        handler: () => actions.onSetPreviewMode(true),
      } : null,
      includeExtra && previewMode ? {
        title: 'Disable Preview',
        icon: icons.look,
        handler: () => actions.onSetPreviewMode(false),
      } : null,
      '-', {
        title: 'List Websites',
        icon: icons.content,
        handler: onListWebsites,
      }, {
        title: 'Help',
        icon: icons.help,
        handler: actions.onViewHelp,
      }, '-', {
        title: 'Logout',
        icon: icons.logout,
        handler: actions.onLogout,
      }].filter(i => i)
    },
      [
        actions,
        previewMode,
      ]
    )

  const getButton = onClick => (
    <div
      className={ classes.logoLink }
      onClick={ onClick }
    >
      <img src="images/favicon.png" className={ classes.logo } />
    </div>
  )

  return (
    <React.Fragment>
      <Hidden smDown>
        <MenuButton
          items={ getMenuItems(false) }
          icon={ icons.settings }
          getButton={ getButton }
        />
      </Hidden>
      <Hidden mdUp>
        <MenuButton
          items={ getMenuItems(true) }
          icon={ icons.settings }
          getButton={ getButton }
        />
      </Hidden>
    </React.Fragment>
    
    
  )
}

export default GlobalOptions

/*

  <Fab
          size="small"
          color="secondary"
          onClick={ onClick }
        >
          <SettingsIcon />
        </Fab>

*/