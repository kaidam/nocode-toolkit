import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import formActions from '@nocode-works/template/store/modules/form'
import EditableElement from './EditableElement'

const EditableSettings = ({
  prefix,
  schema,
  values,
  title,
  size,
  children,
} = {}) => {

  const dispatch = useDispatch()
  const onClick = useCallback(() => {
    dispatch(formActions.editSettingsPrefix({
      schema,
      prefix,
      values,
      title,
      size,
    }))
  }, [
    schema,
    prefix,
    values,
    title,
    size,
  ])

  return (
    <EditableElement
      onClick={ onClick }
    >
      { children }
    </EditableElement>
  )
}

export default EditableSettings
