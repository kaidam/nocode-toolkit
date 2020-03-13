import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Actions from '../../utils/actions'
import settingsActions from '../../store/modules/settings'
import settingsSelectors from '../../store/selectors/settings'
import FormWrapper from '../form/Wrapper'
import Window from '../dialog/Window'

import Panels from './Panels'

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
              <Panels
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