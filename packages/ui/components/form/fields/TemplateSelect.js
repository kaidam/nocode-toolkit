import React from 'react'
import { useSelector } from 'react-redux'
import Select from './Select'
import selectors from '../../../store/selectors'

const TemplateSelectField = (props) => {

  const templates = useSelector(selectors.ui.templates)

  const options = templates.map(template => {
    return {
      title: template.name,
      value: template.id,
    }
  })

  const value = props.field.value || 'default'
  
  const item = Object.assign({}, props.item, {
    options,
  })

  const field = Object.assign({}, props.field, {
    value,
  })

  return (
    <Select {...props} item={item} field={field} />
  )
}

export default TemplateSelectField