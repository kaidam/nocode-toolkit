import React from 'react'

import Window from '../dialog/Window'
import FormWrapper from './Wrapper'
import Render from './Render'

const FormDialog = ({
  schema,
  handlers = {},
  initialValues,
  error,
  loading,
  children,
  onSubmit,
  onCancel,
  renderProps = {},
  formProps = {},
  ...windowProps
}) => {
  return (
    <FormWrapper
      schema={ schema }
      initialValues={ initialValues }
      handlers={ handlers }
      onSubmit={ onSubmit }
      { ...formProps }
    >
      {
        ({
          isValid,
          values,
          errors,
          showErrors,
          touched,
          onSubmit,
        }) => {
          return (
            <Window
              open
              loading={ loading }
              disabled={ isValid ? false : true }
              onSubmit={ onSubmit }
              onCancel={ onCancel }
              { ...windowProps }
            >
              <Render
                fullHeight
                schema={ schema }
                handlers={ handlers }
                error={ error }
                isValid={ isValid }
                values={ values }
                errors={ errors }
                touched={ touched }
                showErrors={ showErrors }
                onSubmit={ onSubmit }
                { ...renderProps }
              />
              { children }
            </Window>
          )
        }
      }
    </FormWrapper>
  )
}

export default FormDialog