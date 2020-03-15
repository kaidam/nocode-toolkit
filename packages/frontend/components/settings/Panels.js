import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'

import Actions from '../../utils/actions'
import settingsSelectors from '../../store/selectors/settings'
import routerSelectors from '../../store/selectors/router'
import routerActions from '../../store/modules/router'

import FormRender from '../form/Render'

import Tabs from '../widgets/Tabs'
import Panels from '../widgets/Panels'
import DialogButtons from '../widgets/DialogButtons'

import Domains from './Domains'
import PluginInstall from './PluginInstall'
import Snippets from './Snippets'


import library from '../../library'
import icons from '../../icons'

const QUERY_NAMES = {
  tab: `dialog_settings_tab`,
  panel: `dialog_settings_panel`,
}

const useStyles = makeStyles(theme => ({
  formContainer: {
    padding: theme.spacing(2),
  },
  header: {
    borderBottom: '1px solid #e5e5e5',
  },
  footer: {
    borderTop: '1px solid #e5e5e5',
  },
}))

const PANELS = [{
  id: 'general',
  title: 'General',
  icon: icons.settings,
  render: ({
    currentTabId,
    librarySettings,
    renderForm,
    onChangeTab,
  }) => {
    const currentTab = librarySettings.tabs.find(tab => tab.id == currentTabId) || librarySettings.tabs[0]
    return {
      header: (
        <Tabs
          tabs={ librarySettings.tabs }
          current={ currentTab.id }
          onChange={ onChangeTab }
        />
      ),
      body: renderForm({
        schema: currentTab.schema,
      }),
    }
  }
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
      title: 'Install Plugins',
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
  render: () => ({
    body: (
      <Domains />
    )
  })
}, {
  id: 'snippets',
  title: 'Snippets',
  icon: icons.code,
  render: ({
    snippets,
    onUpdateSnippets,
  }) => {
    return {
      body: (
        <Snippets
          snippets={ snippets }
          onUpdate={ onUpdateSnippets }
        />
      )
    }
  }
}]

const renderPanel = ({
  panel,
  onSubmit,
  onCancel,
  ...props
}) => {
  const results = panel.render(props)
  results.footer = (
    <DialogButtons
      withSubmit={ panel.submitButton === false ? false : true }
      onSubmit={ onSubmit }
      onCancel={ onCancel }
    />
  )
  return results
}

const SettingsPanels = ({
  isValid,
  values,
  errors,
  showErrors,
  touched,
  onSetFieldValue,
  onSubmit,
  onCancel,
}) => {

  const classes = useStyles()
  const queryParams = useSelector(routerSelectors.queryParams)

  const tab = queryParams[QUERY_NAMES.tab]
  const panel = queryParams[QUERY_NAMES.panel]
  
  const actions = Actions(useDispatch(), {
    onChangeTab: (newTab) => routerActions.addQueryParams({
      [QUERY_NAMES.tab]: newTab,
    }),
    onChangePanel: (newPanel) => routerActions.addQueryParams({
      [QUERY_NAMES.panel]: newPanel,
      [QUERY_NAMES.tab]: '',
    }),
  })

  const {
    activePluginMap = {},
    snippets = [],
  } = values

  const onTogglePlugin = (id) => {
    onSetFieldValue('activePluginMap', Object.assign({}, activePluginMap, {
      [id]: activePluginMap[id] ? false : true,
    }))
  }

  const onUpdateSnippets = (newSnippets) => {
    onSetFieldValue('snippets', newSnippets)
  }

  const librarySettings = useSelector(settingsSelectors.librarySettings)

  const renderForm = ({
    schema,
  }) => {
    return (
      <div className={ classes.formContainer }>
        <FormRender
          schema={ schema }
          values={ values }
          errors={ errors }
          showErrors={ showErrors }
          touched={ touched }
          isValid={ isValid }
        />
      </div>
    )
  }

  const currentPanel = PANELS.find(panelItem => panelItem.id == panel) || PANELS[0]

  const renderResults = renderPanel({
    panel: currentPanel,
    currentTabId: tab,
    activePluginMap,
    snippets,
    librarySettings,
    renderForm,
    onChangeTab: actions.onChangeTab,
    onTogglePlugin,
    onUpdateSnippets,
    onSubmit,
    onCancel,
  })

  const panels = (
    <Panels
      panels={ PANELS }
      current={ currentPanel.id }
      theme={{
        header: classes.header,
        footer: classes.footer,
      }}
      onChange={ actions.onChangePanel }
      {...renderResults}
    />
  )

  return panels
}

export default SettingsPanels