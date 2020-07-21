import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Actions from '../../utils/actions'

import settingsActions from '../../store/modules/settings'
import systemActions from '../../store/modules/system'
import dialogActions from '../../store/modules/dialog'
import uiActions from '../../store/modules/ui'
import jobActions from '../../store/modules/job'
import publishActions from '../../store/modules/publish'
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

const useGlobalOptions = ({
  
}) => {
  const actions = Actions(useDispatch(), {
    onOpenSettings: settingsActions.openDialog,
    onSetPreviewMode: uiActions.setPreviewMode,
    onRebuild: () => jobActions.rebuild({withSnackbar:true}),
    onPublish: publishActions.publish,
    onViewHistory: publishActions.openHistory,
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
      id: 'build',
      title: 'Build Website',
      icon: icons.send,
      iconColor: 'secondary',
      handler: actions.onPublish,
    },{
      id: 'settings',
      title: 'Settings',
      icon: icons.settings,
      handler: () => onOpenSettingsPanel('general'),
    },{
      title: `${previewMode ? 'Disable' : 'Enable'} Preview`,
      icon: previewMode ? icons.hide : icons.look,
      handler: previewMode ? onDisablePreview : onEnablePreview,
    },{
      title: 'Re-Sync Drive',
      icon: icons.refresh,
      handler: actions.onRebuild,
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
    },
    '-',
    {
      title: 'Get Help',
      icon: icons.help,
      handler: actions.onViewHelp,
    }, {
      title: 'Nocode Guide',
      icon: icons.guide,
      handler: () => window.open('https://guide.nocode.works'),
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

export default useGlobalOptions
