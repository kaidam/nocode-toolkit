import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Actions from '../../utils/actions'

import settingsActions from '../../store/modules/settings'
import systemActions from '../../store/modules/system'
import dialogActions from '../../store/modules/dialog'
import uiActions from '../../store/modules/ui'
import jobActions from '../../store/modules/job'
import uiSelectors from '../../store/selectors/ui'
import icons from '../../icons'

const useGetGlobalOptions = ({
  includeExtra = false,
}) => {
  const actions = Actions(useDispatch(), {
    onOpenSettings: settingsActions.openDialog,
    onSetPreviewMode: uiActions.setPreviewMode,
    onRebuild: () => jobActions.rebuild({withSnackbar:true}),
    onPublish: jobActions.publish,
    onViewHistory: jobActions.openHistory,
    onLogout: systemActions.logout,
    onViewHelp: () => dialogActions.open('help'),
  })

  const onEnablePreview = () => actions.onSetPreviewMode(true)
  const onDisablePreview = () => actions.onSetPreviewMode(false)
  const onListWebsites = () => document.location = '/'

  const previewMode = useSelector(uiSelectors.previewMode)

  const getMenuItems = useCallback(() => {
    return [{
      title: 'Build Website',
      icon: icons.send,
      handler: actions.onPublish,
    }, {
      title: 'History',
      icon: icons.history,
      handler: actions.onViewHistory,
    }, {
      title: 'Settings',
      icon: icons.settings,
      handler: actions.onOpenSettings,
    },
    includeExtra ? {
      title: 'Reload',
      icon: icons.refresh,
      handler: actions.onRebuild,
    } : null,
    includeExtra && !previewMode ? {
      title: 'Enable Preview',
      icon: icons.look,
      handler: onEnablePreview,
    } : null,
    includeExtra && previewMode ? {
      title: 'Disable Preview',
      icon: icons.look,
      handler: onDisablePreview,
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
  }, [
    previewMode,
    includeExtra,
  ])

  return getMenuItems
}

export default useGetGlobalOptions