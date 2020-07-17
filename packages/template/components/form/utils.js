import fields, { defaultValues } from './fields'
import dotProp from 'dot-prop'

const flattenSchema = (schema) => {
  return schema.reduce((all, row) => {
    return row.constructor === Array ?
      all.concat(row) :
      all.concat([row])
  }, [])
}

const getComponent = (component) => {
  let Component = typeof(component) === 'string' ?
      fields[component] :
      component

  if(!Component) Component = fields.text

  return Component
}

const getInitialValues = (schema, initialValues) => {
  const flatSchema = flattenSchema(schema)
  let values = {}
  flatSchema.forEach(field => {
    const existing = dotProp.get(initialValues, field.id)
    const component = field.component || 'text'
    const hasValue = typeof(existing) !== 'undefined'
    let useValue = existing
    if(!hasValue) {
      if(field.list) {
        useValue = []
      }
      else if (typeof(field.default) !== 'undefined') {
        useValue = field.default
      }
      else if(typeof(component) === 'string' && defaultValues[component]) {
        useValue = defaultValues[component]
      }
    }
    dotProp.set(values, field.id, useValue)
  })

  // include anything else at the top level (but not nested)
  Object.keys(initialValues).forEach(key => {
    if(typeof(values[key]) == 'undefined') {
      values[key] = initialValues[key]
    }
  })
  return values
}

const utils = {
  flattenSchema,
  getComponent,
  getInitialValues,
}

export default utils