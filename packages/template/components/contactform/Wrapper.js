import React, { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import actions from '../../store/modules/contactform'
import selectors from '../../store/selectors/contactform'

import Button from './Button'
import Form from './Form'
import FormDialog from './FormDialog'
import { processSettings, getFields } from './schema'

const ContactFormWrapper = ({
  data = {},
  cell,
}) => {

  const dispatch = useDispatch()
  const formId = useSelector(selectors.formId)
  const values = useSelector(selectors.values)
  const errors = useSelector(selectors.errors)

  const isFormOpen = formId == cell.id

  const onButtonClick = useCallback(() => {
    dispatch(actions.setFormId(cell.id))
  }, [cell.id])

  const onFormChange = useCallback((payload) => {
    dispatch(actions.setValue(payload))
  }, [])

  

  const onFormCancel = useCallback(() => {
    dispatch(actions.setFormId(null))
  }, [])

  const settings = useMemo(() => {
    return processSettings(data)
  }, [
    data,
  ])

  const useFields = useMemo(() => {
    const fields = getFields(settings)
    return fields.map(field => {
      return Object.assign({}, field, {
        onChange: (value) => {
          onFormChange({
            id: field.id,
            value,
          })
        }
      })
    })
  }, [
    settings,
    onFormChange,
  ])

  const onFormSubmit = useCallback(() => {
    dispatch(actions.submit({
      settings,
      fields: useFields,
    }))
  }, [
    settings,
    useFields,
  ])

  if (settings.displayMode == 'inline') {
    return (
      <div style={{ width: '100%' }}>
        <Form
          values={ values }
          errors={ errors }
          settings={ settings }
          fields={ useFields }
          onChange={ onFormChange }
        />
        <Button
          content={ settings }
          onClick={ onFormSubmit }
        />

      </div>
    )
  } else {
    return (
      <div style={{ width: '100%' }}>
        <Button
          content={ data }
          onClick={ onButtonClick }
        />
        {
          isFormOpen && (
            <FormDialog
              values={ values }
              errors={ errors }
              settings={ settings }
              fields={ useFields }
              onChange={ onFormChange }
              onSubmit={ onFormSubmit }
              onClose={ onFormCancel }
            />
          )
        }
      </div>
    )
  }
  
}

export default ContactFormWrapper