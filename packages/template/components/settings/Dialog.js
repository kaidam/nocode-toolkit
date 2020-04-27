import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import Actions from '../../utils/actions'
import settingsActions from '../../store/modules/settings'
import settingsSelectors from '../../store/selectors/settings'
import routerSelectors from '../../store/selectors/router'
import routerActions from '../../store/modules/router'

import FormWrapper from '../form/Wrapper'
import Window from '../dialog/Window'

import Panels from './Panels'

import Tabs from '../widgets/Tabs'
import Domains from './Domains'
import Security from './Security'
import PluginInstall from './PluginInstall'
import Snippets from './Snippets'

import library from '../../library'
import icons from '../../icons'

const QUERY_NAMES = {
  tab: `dialog_settings_tab`,
  panel: `dialog_settings_panel`,
}

const settingsTabRender = (tabName, title) => ({
  classes,
  librarySettings,
  renderForm,
}) => {
  const currentTab = librarySettings.tabs.find(tab => tab.id == tabName) || librarySettings.tabs[0]
  return {
    header: (
      <Typography variant="h6" className={ classes.headingTitle }>{ title }</Typography>
    ),
    body: renderForm({
      schema: currentTab.schema,
    }),
  }
}

const PANELS = [{
  id: 'general',
  title: 'General',
  icon: icons.settings,
  render: settingsTabRender('main', 'General Settings'),
}, {
  id: 'layout',
  title: 'Layout',
  icon: icons.layout,
  render: settingsTabRender('layout', 'Layout Settings'),
}, {
  id: 'plugins',
  title: 'Plugins',
  icon: icons.plugin,
  render: ({
    currentTabId,
    activePluginMap,
    renderForm,
    onChangeTab,
    onTogglePlugin,
  }) => {
    const pluginFormTabs = [{
      id: 'install',
      title: 'Activate Plugins',
    }].concat(
      library.plugins
        .filter(plugin => plugin.settings ? true : false)
        .filter(plugin => activePluginMap[plugin.id] ? true : false)
        .reduce((all, plugin) => {
          return all.concat(plugin.settings.tabs)
        }, [])
    )
    const currentTab = pluginFormTabs.find(tab => tab.id == currentTabId) || pluginFormTabs[0]
    return {
      header: (
        <Tabs
          tabs={ pluginFormTabs }
          current={ currentTab.id }
          onChange={ onChangeTab }
        />
      ),
      body: currentTab.id == 'install' ?
        (
          <PluginInstall
            active={ activePluginMap }
            onToggle={ onTogglePlugin }
          />
        ) :
        renderForm({
          schema: currentTab.schema,
        })
    }
  }
}, {
  id: 'domain',
  title: 'Domains',
  icon: icons.domain,
  submitButton: false,
  render: ({
    classes,
  }) => ({
    header: (
      <Grid container>
        <Grid item xs={ 6 }>
          <Typography variant="h6" className={ classes.headingTitle }>Nocode Subdomain</Typography>
        </Grid>
        <Grid item xs={ 6 }>
          <Typography variant="h6" className={ classes.headingTitle }>Custom Domains</Typography>
        </Grid>
      </Grid>
    ),
    body: (
      <Domains />
    )
  })
}, {
  id: 'snippets',
  title: 'Snippets',
  size: 'md',
  icon: icons.code,
  render: ({
    classes,
    currentTabId,
    snippets,
    onUpdateSnippets,
    onChangeTab,
  }) => {
    const snippetTabs = [{
      id: 'normal',
      title: 'Snippets',
    },{
      id: 'global',
      title: 'Global Snippets',
    },{
      id: 'file',
      title: 'File Snippets',
    }]
    const currentTab = snippetTabs.find(tab => tab.id == currentTabId) || snippetTabs[0]
    return {
      header: (
        <Tabs
          tabs={ snippetTabs }
          current={ currentTab.id }
          onChange={ onChangeTab }
        />
      ),
      body: (
        <Snippets
          type={ currentTab.id }
          snippets={ snippets }
          onUpdate={ onUpdateSnippets }
        />
      )
    }
  }
}, {
  id: 'security',
  title: 'Security',
  icon: icons.lock,
  submitButton: false,
  render: ({
    classes,
  }) => ({
    header: (
      <Typography variant="h6" className={ classes.headingTitle }>Website Security</Typography>
    ),
    body: (
      <Security />
    )
  })
}]

const SettingsDialog = ({

}) => {

  const queryParams = useSelector(routerSelectors.queryParams)

  const tab = queryParams[QUERY_NAMES.tab]
  const panel = queryParams[QUERY_NAMES.panel]

  const settingsSchema = useSelector(settingsSelectors.schema)
  const settingsInitialValues = useSelector(settingsSelectors.settings)

  const currentPanel = PANELS.find(panelItem => panelItem.id == panel) || PANELS[0]

  const actions = Actions(useDispatch(), {
    onChangeTab: (newTab) => routerActions.addQueryParams({
      [QUERY_NAMES.tab]: newTab,
    }),
    onChangePanel: (newPanel) => routerActions.addQueryParams({
      [QUERY_NAMES.panel]: newPanel,
      [QUERY_NAMES.tab]: '',
    }),
    onCancel: settingsActions.closeDialog,
    onSubmit: settingsActions.saveSettings,
  })

  const onCloseWindow = useCallback(() => {
    actions.onCancel()
  }, [])

  return (
    <FormWrapper
      schema={ settingsSchema }
      initialValues={ settingsInitialValues }
      onSubmit={ actions.onSubmit }
    >
      {
        ({
          isValid,
          values,
          errors,
          showErrors,
          touched,
          onSubmit,
          onSetFieldValue,
        }) => {
          return (
            <Window
              open
              compact
              noScroll
              noActions
              size={ currentPanel.size || 'md' }
              fullHeight
              onCancel={ onCloseWindow }
            >
              <Panels
                panelSettings={ PANELS }
                tab={ tab }
                panel={ panel }
                isValid={ isValid }
                values={ values }
                errors={ errors }
                showErrors={ showErrors }
                touched={ touched }
                onCancel={ onCloseWindow }
                onSubmit={ onSubmit }
                onChangeTab={ actions.onChangeTab }
                onChangePanel={ actions.onChangePanel }
                onSetFieldValue={ onSetFieldValue }
              />
            </Window>
          )
        }
      }
    </FormWrapper>
  )
}

export default SettingsDialog