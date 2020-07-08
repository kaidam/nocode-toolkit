import React, { useMemo } from 'react'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import MaterialTextField from '@material-ui/core/TextField'
import FIELDS from './fields'

const TextField = ({
  field,
  error,
  value,
}) => {
  return (
    <MaterialTextField
      fullWidth
      error={ error ? true : false }
      label={ field.title }
      helperText={ error || field.description }
      value={ value }
      onChange={ (ev) => field.onChange(ev.target.value) } 
    />
  )
}

const TextArea = ({
  field,
  error,
  value,
}) => {
  return (
    <MaterialTextField
      fullWidth
      error={ error ? true : false }
      label={ field.title }
      helperText={ error || field.description }
      value={ value }
      multiline
      rows={ 5 }
      onChange={ (ev) => field.onChange(ev.target.value) } 
    />
  )
}

const COMPONENTS = {
  textfield: TextField,
  textarea: TextArea,
}

const FormDialog = ({
  values,
  errors,
  onChange,
  onSubmit,
  onClose,
}) => {

  const fields = useMemo(() => {
    return FIELDS.map(field => {
      return Object.assign({}, field, {
        onChange: (value) => {
          onChange({
            id: field.id,
            value,
          })
        }
      })
    })
  }, [FIELDS, onChange])

  return (
    <Dialog
      open={ true }
      onClose={ onClose }
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        Contact Form
      </DialogTitle>
      <DialogContent>
        <div>
          {
            fields.map((field, i) => {
              const Field = COMPONENTS[field.component] || COMPONENTS.textfield

              const value = values[field.id] || ''
              const error = errors[field.id] || ''

              return (
                <div key={ i }>
                  <Field
                    field={ field }
                    value={ value }
                    error={ error }
                  />
                </div>
              )
            })
          }
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          type="button"
          variant="contained"
          onClick={ onClose }
        >
          Close
        </Button>
        <Button
          type="button"
          variant="contained"
          onClick={ onSubmit }
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FormDialog