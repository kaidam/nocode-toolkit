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

/*

  Build
  Reload
  Preview
  -----
  Site Settings (Colour, Site SEO)
  Layout (Site Options, Page Options)
  -----
  Plugins
  Snippets
  Security
  Domains
  -----
  History
  Website List
  Help (Could this just fire up the Crisp window rather than a dialog you then click to initiate?)
  Logout (edited) 

*/

const useGetGlobalOptions = ({
  
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

  const onOpenSettingsPanel = (panel) => {
    actions.onOpenSettings({
      panel,
    })
  }

  const previewMode = useSelector(uiSelectors.previewMode)

  const getMenuItems = useCallback(() => {
    return [{
      title: 'Build Website',
      icon: icons.send,
      handler: actions.onPublish,
    },{
      title: 'Reload',
      icon: icons.refresh,
      handler: actions.onRebuild,
    },{
      title: `${previewMode ? 'Disable' : 'Enable'} Preview`,
      icon: previewMode ? icons.hide : icons.look,
      handler: previewMode ? onDisablePreview : onEnablePreview,
    },
    '-',
    {
      title: 'Settings',
      icon: icons.settings,
      handler: () => onOpenSettingsPanel('general'),
    }, {
      title: 'Layout',
      icon: icons.layout,
      handler: () => onOpenSettingsPanel('layout'),
    }, 
    '-',
    {
      title: 'Plugins',
      icon: icons.plugin,
      handler: () => onOpenSettingsPanel('plugins'),
    }, {
      title: 'Snippets',
      icon: icons.code,
      handler: () => onOpenSettingsPanel('snippets'),
    },{
      title: 'Security',
      icon: icons.lock,
      handler: () => onOpenSettingsPanel('security'),
    },{
      title: 'Domains',
      icon: icons.domain,
      handler: () => onOpenSettingsPanel('domain'),
    },
    '-',
    {
      title: 'History',
      icon: icons.history,
      handler: actions.onViewHistory,
    }, {
      title: 'Website List',
      icon: icons.content,
      handler: onListWebsites,
    }, {
      title: 'Help',
      icon: icons.help,
      handler: actions.onViewHelp,
    }, {
      title: 'Logout',
      icon: icons.logout,
      handler: actions.onLogout,
    }].filter(i => i)
  }, [
    previewMode,
  ])

  return getMenuItems
}

export default useGetGlobalOptions