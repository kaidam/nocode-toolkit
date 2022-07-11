import React from 'react'

import MaterialTextField from '@material-ui/core/TextField'

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

const Form = ({
  values,
  fields,
  errors,
}) => {

  return (
    <div>
      {
        fields.map((field, i) => {
          const Field = COMPONENTS[field.component] || COMPONENTS.textfield

          const value = values[field.id] || ''
          const error = errors[field.id] || ''

          return (
            <div key={ i } style={{marginBottom: '8px'}}>
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
  )
}

export default Form