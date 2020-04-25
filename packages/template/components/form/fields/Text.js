import React from 'react'
import TextField from '@material-ui/core/TextField'

const Text = ({
  field: {
    name,
    value,
    onChange,
    onBlur
  },
  error,
  touched,
  item,
  values,
  handlers,
  handlerContext,
}) => {
  const inputProps = item.inputProps || {}

  const disabled = handlers && handlers.isDisabled ?
    handlers.isDisabled({
      name,
      value,
      values,
      context: handlerContext,
    }) : false

  const useValue = handlers && handlers.getValue ?
    handlers.getValue({
      name,
      value,
      values,
      context: handlerContext,
    }) : value

  return (
    <TextField
      fullWidth
      id={ name }
      name={ name }
      label={ item.title || item.id }
      helperText={ touched && error ? error : item.helperText }
      error={ touched && Boolean(error) }
      value={ useValue || '' }
      onChange={ onChange }
      onBlur={ onBlur }
      disabled={ disabled }
      { ...inputProps }
    />
  )
}

export default Text