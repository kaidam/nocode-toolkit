import React, { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import Actions from '../../utils/actions'

import Fab from '@material-ui/core/Fab'

import uiActions from '../../store/modules/ui'
import jobActions from '../../store/modules/job'
import icons from '../../icons'

import MenuButton from './MenuButton'

const SettingsIcon = icons.settings

const onOpenSettings = () => uiActions.openDialogSingleton('settings', 'settings')
const onListWebsites = () => document.location = '/'

const GlobalOptions = ({

}) => {
  const actions = Actions(useDispatch(), {
    onOpenSettings,
    onLogout: uiActions.logout,
    onRebuild: jobActions.rebuild,
    onPublish: jobActions.publish,
    onViewHistory: jobActions.openHistory,
  })

  const menuItems = useMemo(
    () => {
      return [{
        title: 'Settings',
        icon: icons.settings,
        handler: actions.onOpenSettings,
      }, {
        title: 'Publish Now',
        icon: icons.publish,
        handler: actions.onPublish,
      }, {
        title: 'Publish History',
        icon: icons.history,
        handler: actions.onViewHistory,
      }, {
        title: 'Rebuild Preview',
        icon: icons.refresh,
        handler: actions.onRebuild,
      }, '-', {
        title: 'List Websites',
        icon: icons.content,
        handler: onListWebsites,
      }, {
        title: 'Logout',
        icon: icons.logout,
        handler: actions.onLogout,
      }]
    },
      [actions]
    )

  return (
    <MenuButton
      items={ menuItems }
      icon={ icons.settings }
      getButton={ onClick => (
        <Fab
          size="small"
          color="secondary"
          onClick={ onClick }
        >
          <SettingsIcon />
        </Fab>
      )}
    />
  )
}

export default GlobalOptions