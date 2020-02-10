import React, { useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'
import Actions from '../../utils/actions'
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
    onLogout: uiActions.logout,
    onRebuild: jobActions.rebuild,
    onPublish: jobActions.publish,
    onViewHistory: jobActions.openHistory,
    onViewHelp: uiActions.openHelp,
  })

  const menuItems = useMemo(
    () => {
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
      }, '-', {
        title: 'List Websites',
        icon: icons.content,
        handler: onListWebsites,
      }, {
        title: 'Logout',
        icon: icons.logout,
        handler: actions.onLogout,
      }, {
        title: 'Help',
        icon: icons.help,
        handler: actions.onViewHelp,
      }]
    },
      [actions]
    )

  return (
    <MenuButton
      items={ menuItems }
      icon={ icons.settings }
      getButton={ onClick => (
        <div
          className={ classes.logoLink }
          onClick={ onClick }
        >
          <img src="images/favicon.png" className={ classes.logo } />
        </div>
        
      )}
    />
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