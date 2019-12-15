import React, { useMemo } from 'react'

import FIELDS from '../fields'

const styles = {
  root: {
    position: 'fixed',
    left: '0px',
    top: '0px',
    width: '100%',
    height: '100%',
    zIndex: '1000',
    backgroundColor: 'rgba(255,255,255,0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: '50px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #000000',
    fontWeight: 'bold',
    textAlign: 'center',
  }
}

const TextField = ({
  field,
  error,
  value,
}) => {
  return (
    <div>
      <p>{ field.title }</p>
      <input value={ value } onChange={ (ev) => field.onChange(ev.target.value) } />
      {
        error && <p style={{color: 'red'}}>{ error }</p>
      }
    </div>
  )
}

const TextArea = ({
  field,
  error,
  value,
}) => {
  return (
    <div>
      <p>{ field.title }</p>
      <textarea value={ value } onChange={ (ev) => field.onChange(ev.target.value) } />
      {
        error && <p style={{color: 'red'}}>{ error }</p>
      }
    </div>
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
    <div style={ styles.root }>
      <div style={ styles.content }>
        <h4>Contact Form</h4>
        <div>
          {
            fields.map((field, i) => {
              const Field = COMPONENTS[field.component] || COMPONENTS.textfield

              const value = values[field.id] || ''
              const error = errors[field.id] || ''

              return (
                <Field
                  key={ i }
                  field={ field }
                  value={ value }
                  error={ error }
                />
              )
            })
          }
        </div>
        <p>
          <button
            onClick={ onClose }
          >
            Close
          </button>
          <button
            onClick={ onSubmit }
          >
            Submit
          </button>
        </p>
      </div>
    </div>
  )
}

export default FormDialog