import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Actions from '../../utils/actions'
import uiActions from '../../store/modules/ui'
import uiSelectors from '../../store/selectors/ui'

import library from '../../library'
import settingsActions from '../../store/modules/settings'
import settingsSelectors from '../../store/selectors/settings'

import FormWrapper from '../form/Wrapper'
import FormRender from '../form/Render'
import Window from '../dialog/Window'

import Tabs from '../widgets/Tabs'
import Panels from '../widgets/Panels'

const SettingsContent = ({
  handleSubmit,
  isValid,
  values,
  errors,
  showErrors,
  touched,
}) => {
  const librarySettings = useSelector(settingsSelectors.librarySettings)

  const tabs = useMemo(() => {
    const tabData = librarySettings.tabs.map(tab => {
      return {
        id: tab.id,
        title: tab.title,
        element: (
          <FormRender
            schema={ tab.schema }
            values={ values }
            errors={ errors }
            showErrors={ showErrors }
            touched={ touched }
            isValid={ isValid }
          />
        )
      }
    })
    return (
      <Tabs
        tabs={ tabData }
      />
    )
  }, [
    errors,
    showErrors,
    librarySettings,
  ])

  return tabs
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
              noScroll
              compact
              size="xl"
              onSubmit={ handleSubmit }
              onCancel={ actions.onCancel }
            >
              <SettingsContent
                handleSubmit={ handleSubmit }
                isValid={ isValid }
                values={ values }
                errors={ errors }
                showErrors={ showErrors }
                touched={ touched }
              />
            </Window>
          )
        }
      }
    </FormWrapper>
  )
}

export default SettingsDialog