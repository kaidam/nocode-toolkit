import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Actions from '../../utils/actions'
import settingsActions from '../../store/modules/settings'
import settingsSelectors from '../../store/selectors/settings'
import FormWrapper from '../form/Wrapper'
import Window from '../dialog/Window'

import Panels from './Panels'

const SettingsDialog = ({

}) => {

  const settingsSchema = useSelector(settingsSelectors.schema)
  const settingsInitialValues = useSelector(settingsSelectors.settings)

  const actions = Actions(useDispatch(), {
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
              fullHeight
              compact
              noScroll
              noActions
              size="lg"
              onCancel={ onCloseWindow }
            >
              <Panels
                isValid={ isValid }
                values={ values }
                errors={ errors }
                showErrors={ showErrors }
                touched={ touched }
                onCancel={ onCloseWindow }
                onSubmit={ onSubmit }
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