import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Actions from '../../utils/actions'
import uiActions from '../../store/modules/ui'
import uiSelectors from '../../store/selectors/ui'

import settingsActions from '../../store/modules/settings'

import FormWrapper from '../form/Wrapper'
import Window from '../dialog/Window'

const SettingsDialog = ({

}) => {

  const actions = Actions(useDispatch(), {
    onCancel: () => settingsActions.closeDialog(),
    onSubmit: () => settingsActions.closeDialog(),
  })

  return (
    <FormWrapper
      schema={ [] }
      initialValues={ {} }
      onSubmit={ actions.onSubmit }
    >
      {
        ({
          handleSubmit,
          isValid,
          values,
          errors,
          touched,
        }) => {
          return (
            <Window
              open
              fullHeight
              size="xl"
              title="Settings"
              onSubmit={ actions.onSubmit }
              onCancel={ actions.onCancel }
            >
              This is the settings window
            </Window>
          )
        }
      }
    </FormWrapper>
  )
}

export default SettingsDialog