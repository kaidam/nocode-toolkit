import { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Actions from '../../utils/actions'

import uiSelectors from '../../store/selectors/ui'
import icons from '../../icons'

const globalOptions = ({
  includeExtra = false,
}) => {
  const actions = Actions(useDispatch(), {
    onOpenSettings: () => {},/*uiActions.openSettings,*/
    onSetPreviewMode: () => {},/*uiActions.setPreviewMode,*/
    onLogout: () => {},/*uiActions.logout,*/
    onRebuild: () => {},/*jobActions.rebuild,*/
    onPublish: () => {},/*jobActions.publish,*/
    onViewHistory: () => {},/*jobActions.openHistory,*/
    onViewHelp: () => {},/*uiActions.openHelp,*/
  })

  const onEnablePreview = () => actions.onSetPreviewMode(true)
  const onDisablePreview = () => actions.onSetPreviewMode(false)
  const onListWebsites = () => document.location = '/'

  const previewMode = useSelector(uiSelectors.previewMode)

  const menuItems = useMemo(() => {
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

  return menuItems
}

export default globalOptions