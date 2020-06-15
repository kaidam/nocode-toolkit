import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'

import settingsSelectors from '../../store/selectors/settings'

import FormRender from '../form/Render'

import Panels from '../widgets/Panels'
import DialogButtons from '../widgets/DialogButtons'

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
  headingTitle: {
    padding: theme.spacing(1),
  }
}))

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
  panelSettings,
  tab,
  panel,
  isValid,
  values,
  errors,
  showErrors,
  touched,
  onSubmit,
  onCancel,
  onChangeTab,
  onChangePanel,
  onSetFieldValue,
}) => {

  const classes = useStyles()
  
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
          onSetFieldValue={ onSetFieldValue }
        />
      </div>
    )
  }

  const currentPanel = panelSettings.find(panelItem => panelItem.id == panel) || panelSettings[0]

  const renderResults = renderPanel({
    classes,
    panel: currentPanel,
    currentTabId: tab,
    activePluginMap,
    snippets,
    librarySettings,
    renderForm,
    onChangeTab,
    onTogglePlugin,
    onUpdateSnippets,
    onSubmit,
    onCancel,
  })

  const panels = (
    <Panels
      panels={ panelSettings }
      current={ currentPanel.id }
      theme={{
        header: classes.header,
        footer: classes.footer,
      }}
      showTitles={ true }
      sidebarWidth={ 170 }
      onChange={ onChangePanel }
      {...renderResults}
    />
  )

  return panels
}

export default SettingsPanels