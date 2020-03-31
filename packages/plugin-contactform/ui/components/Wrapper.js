import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import actions from '../store'
import selectors from '../selectors'

import Button from './Button'
import FormDialog from './FormDialog'

const ContactFormWrapper = ({
  content,
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

  const onFormSubmit = useCallback(() => {
    dispatch(actions.submit())
  }, [])

  const onFormCancel = useCallback(() => {
    dispatch(actions.setFormId(null))
  }, [])

  return (
    <div>
      <Button
        content={ content }
        onClick={ onButtonClick }
      />
      {
        isFormOpen && (
          <FormDialog
            values={ values }
            errors={ errors }
            onChange={ onFormChange }
            onSubmit={ onFormSubmit }
            onClose={ onFormCancel }
          />
        )
      }
    </div>
  )
}

export default ContactFormWrapper