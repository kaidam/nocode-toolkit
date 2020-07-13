import library from '../library'

const getFormDefinition = ({
  type,
  data,
  settings,
}) => {
  const widget = library.widgets[type]
  if(!widget) throw new Error(`widget ${type} not found`)

  const cellSettings = library.forms['cell.settings']

  let tabs = []
  let values = {}

  if(widget.form) {
    tabs.push({
      id: 'data',
      title: 'Data',
      schema: widget.form.schema,
    })
    values = Object.assign({}, data)
  }

  tabs = tabs.concat(cellSettings.tabs)
  values = Object.assign({}, values, {settings})
  
  return {
    tabs,
    values,
  }
}

const mergeWidgetForm = ({
  cell,
  values,
}) => {
  const {
    settings,
    ...data
  } = values
  return Object.assign({}, cell, {
    settings,
    data,
  })
}

const utils = {
  getFormDefinition,
  mergeWidgetForm,
}

export default utils