import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Actions from '../../utils/actions'
import contentActions from '../../store/modules/content'
import contentSelectors from '../../store/selectors/content'
import FormWrapper from '../form/Wrapper'
import Window from '../dialog/Window'

import Form from './Form'

const ContentDialog = ({

}) => {

  const formValues = useSelector(contentSelectors.formValues)
  const formSchema = useSelector(contentSelectors.formSchema)

  const actions = Actions(useDispatch(), {
    onCancel: contentActions.cancelFormWindow,
    onSubmit: contentActions.cancelFormWindow,
  })

  return (
    <FormWrapper
      schema={ formSchema }
      initialValues={ formValues }
      onSubmit={ actions.onSubmit }
    >
      {
        ({
          handleSubmit,
          setFieldValue,
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
              <Form
                isValid={ isValid }
                values={ values }
                setFieldValue={ setFieldValue }
                errors={ errors }
                showErrors={ showErrors }
                touched={ touched }
                onSubmit={ handleSubmit }
                onCancel={ actions.onCancel }
              />
            </Window>
          )
        }
      }
    </FormWrapper>
  )
}

export default ContentDialog