import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'

import Button from '@material-ui/core/Button'

import Actions from '../../utils/actions'
import settingsSelectors from '../../store/selectors/settings'
import routerSelectors from '../../store/selectors/router'
import routerActions from '../../store/modules/router'

import FormRender from '../form/Render'

import Tabs from '../widgets/Tabs'
import Panels from '../widgets/Panels'

import Domains from './Domains'
import PluginInstall from './PluginInstall'

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
  buttons: {
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    marginLeft: theme.spacing(2),
  },
}))  

const SettingsButtons = ({
  onSubmit,
  onCancel,
  loading = false,
  withSubmit = false,
}) => {
  const classes = useStyles()
  return (
    <div className={ classes.buttons }>
      <Button
        className={ classes.button }
        type="button"
        variant="contained"
        onClick={ onCancel }
      >
        Cancel
      </Button>
      {
        withSubmit && (
          <Button
            className={ classes.button }
            type="button"
            variant="contained"
            color="primary"
            disabled={ loading ? true : false }
            onClick={ onSubmit }
          >
            Save
          </Button>
        )
      }
    </div>
  )
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
  } = values

  const onTogglePlugin = (id) => {
    onSetFieldValue('activePluginMap', Object.assign({}, activePluginMap, {
      [id]: activePluginMap[id] ? false : true,
    }))
  }

  const librarySettings = useSelector(settingsSelectors.librarySettings)

  const settingsFormTabs = librarySettings.tabs.map(tab => {
    return {
      id: tab.id,
      title: tab.title,
      body: (
        <div className={ classes.formContainer }>
          <FormRender
            schema={ tab.schema }
            values={ values }
            errors={ errors }
            showErrors={ showErrors }
            touched={ touched }
            isValid={ isValid }
          />
        </div>
      )
    }
  })

  const pluginFormTabs = library.plugins
    .filter(plugin => plugin.settings ? true : false)
    .filter(plugin => activePluginMap[plugin.id] ? true : false)
    .reduce((all, plugin) => {
      return all.concat(plugin.settings.tabs.map(tab => {
        return {
          id: tab.id,
          title: tab.title,
          body: (
            <div className={ classes.formContainer }>
              <FormRender
                schema={ tab.schema }
                values={ values }
                errors={ errors }
                showErrors={ showErrors }
                touched={ touched }
                isValid={ isValid }
              />
            </div>
          )
        }
      }))
    }, [])

  const pluginTabs = [{
    id: 'install',
    title: 'Install Plugins',
    body: (
      <PluginInstall
        active={ activePluginMap }
        onToggle={ onTogglePlugin }
      />
    )
  }].concat(pluginFormTabs)

  const currentSettingsTab = settingsFormTabs.find(tabItem => tabItem.id == tab) || settingsFormTabs[0]
  const currentPluginTab = pluginTabs.find(tabItem => tabItem.id == tab) || pluginTabs[0]

  const generalPanel = {
    id: 'general',
    title: 'General',
    icon: icons.settings,
    header: (
      <Tabs
        tabs={ settingsFormTabs }
        current={ currentSettingsTab.id }
        onChange={ actions.onChangeTab }
      />
    ),
    body: currentSettingsTab.body,
    footer: (
      <SettingsButtons
        withSubmit
        onCancel={ onCancel }
        onSubmit={ onSubmit }
      />
    )
  }

  const pluginPanel = {
    id: 'plugins',
    title: 'Plugins',
    icon: icons.plugin,
    header: (
      <Tabs
        tabs={ pluginTabs }
        current={ currentPluginTab.id }
        onChange={ actions.onChangeTab }
      />
    ),
    body: currentPluginTab.body,
    footer: (
      <SettingsButtons
        withSubmit
        onCancel={ onCancel }
        onSubmit={ onSubmit }
      />
    ),
  }

  const domainPanel = {
    id: 'domain',
    title: 'Domains',
    icon: icons.domain,
    body: <Domains />
  }

  const snippetPanel = {
    id: 'snippets',
    title: 'Snippets',
    icon: icons.code,
    body: <div>Snippets</div>
  }

  const panelData = [
    generalPanel,
    pluginPanel,
    domainPanel,
    snippetPanel,
  ]

  let currentPanel = panelData.find(panelItem => panelItem.id == panel)
  currentPanel = currentPanel || panelData[0]

  const panels = (
    <Panels
      panels={ panelData }
      current={ currentPanel.id }
      onChange={ actions.onChangePanel }
    />
  )

  return panels
}

export default SettingsPanels