import React, { useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'

import Button from '@material-ui/core/Button'

import Actions from '../../utils/actions'
import uiActions from '../../store/modules/ui'
import uiSelectors from '../../store/selectors/ui'

import library from '../../library'
import settingsActions from '../../store/modules/settings'
import settingsSelectors from '../../store/selectors/settings'
import routerSelectors from '../../store/selectors/router'
import routerActions from '../../store/modules/router'

import FormWrapper from '../form/Wrapper'
import FormRender from '../form/Render'
import Window from '../dialog/Window'

import Tabs from '../widgets/Tabs'
import Panels from '../widgets/Panels'

import icons from '../../icons'

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

const SettingsContent = ({
  isValid,
  values,
  errors,
  showErrors,
  touched,
  onSubmit,
  onCancel,
}) => {

  const classes = useStyles()
  const {
    tab,
    panel,
  } = useSelector(routerSelectors.queryParams)

  const actions = Actions(useDispatch(), {
    onChangeTab: (tab) => routerActions.addQueryParams({tab}),
    onChangePanel: (panel) => routerActions.addQueryParams({panel,tab:''}),
  })

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

  let currentTab = settingsFormTabs.find(tabItem => tabItem.id == tab)
  currentTab = currentTab || settingsFormTabs[0]

  const generalPanel = {
    id: 'general',
    title: 'General',
    icon: icons.settings,
    header: (
      <Tabs
        tabs={ settingsFormTabs }
        current={ currentTab.id }
        onChange={ actions.onChangeTab }
      />
    ),
    body: currentTab.body,
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
    body: <div>Plugins</div>
  }

  const domainPanel = {
    id: 'domain',
    title: 'Domains',
    icon: icons.domain,
    body: <div>Domains</div>
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

const SettingsDialog = ({

}) => {

  const settingsSchema = useSelector(settingsSelectors.librarySettingsSchema)
  const settingsInitialValues = useSelector(settingsSelectors.librarySettingsInitialValues)

  const actions = Actions(useDispatch(), {
    onCancel: settingsActions.closeDialog,
    onSubmit: settingsActions.saveSettings,
  })

  return (
    <FormWrapper
      schema={ settingsSchema }
      initialValues={ settingsInitialValues }
      onSubmit={ actions.onSubmit }
    >
      {
        ({
          handleSubmit,
          isValid,
          values,
          errors,
          showErrors,
          touched,
        }) => {
          return (
            <Window
              open
              fullHeight
              compact
              noScroll
              noActions
              size="xl"
              onCancel={ actions.onCancel }
            >
              <SettingsContent
                isValid={ isValid }
                values={ values }
                errors={ errors }
                showErrors={ showErrors }
                touched={ touched }
                onCancel={ actions.onCancel }
                onSubmit={ handleSubmit }
              />
            </Window>
          )
        }
      }
    </FormWrapper>
  )
}

export default SettingsDialog