import itemTypes from './item'

const SORT_OPTIONS_SCHEMA = [[
  {
    id: 'annotation.sortType',
    title: 'Sort Children By',
    helperText: 'Choose the method by which the children will be sorted',
    component: 'select',
    options: [{
      title: 'Manually (drag and drop)',
      value: 'manual',
    }, {
      title: 'By Name',
      value: 'name',
    }, {
      title: 'By Date',
      value: 'date',
    }]
  },
  {
    id: 'annotation.sortOrder',
    title: 'Sort Children Direction',
    helperText: 'Choose the direction the children will be sorted in',
    component: 'select',
    options: [{
      title: 'Ascending',
      value: 'asc',
    },{
      title: 'Descending',
      value: 'desc',
    }]
  }
]]

/*

  add the options schema and values for an item

*/
const injectOptionsForm = ({
  driver,
  type,
  schema,
  initialValues,
  item,
  queryParams,
}) => {
  const itemType = itemTypes({
    driver,
    type,
  })
  const hasChildren = itemType.hasChildren({
    driver,
    type,
  })
  let optionsSchemaParts = []

  if(hasChildren) {
    optionsSchemaParts = optionsSchemaParts.concat(SORT_OPTIONS_SCHEMA)

    let sortType = 'manual'
    let sortOrder = 'asc'

    if(item && item.annotation && item.annotation.sort) {
      if(item.annotation.sort.field == 'name') {
        sortType = 'name'
      }
      else if(item.annotation.sort.field == 'date') {
        sortType = 'date'
      }

      if(item.annotation.sort.direction) sortOrder = item.annotation.sort.direction

      initialValues.annotation = Object.assign({}, initialValues.annotation, {
        sortType,
        sortOrder,
      })
    }
  }

  // we don't inject any options when we are in finder mode
  if(optionsSchemaParts.length <= 0 || queryParams.controller == 'finder') {
    return {
      schema,
      initialValues,
    }
  }

  const optionsSchema = schema
    .concat([
      'Options',
    ])
    .concat(optionsSchemaParts)

  return {
    schema: optionsSchema,
    initialValues,
  }
}

/*

  once the content form is saved - 

*/
const getSaveData = ({
  driver,
  type,
  item,
  data,
}) => {
  let existingAnnotation = item ?
    item.annotation :
    null
  existingAnnotation = existingAnnotation || {}
  let newAnnotation = JSON.parse(JSON.stringify(existingAnnotation))
  if(data.annotation && data.annotation.sortType) {
    if(data.annotation.sortType == 'manual') {
      const ids = existingAnnotation.sort && existingAnnotation.sort.ids ?
        existingAnnotation.sort.ids :
        []
      newAnnotation.sort = {
        ids,
      }
    }
    else {
      newAnnotation.sort = {
        field: data.annotation.sortType,
        direction: data.annotation.sortOrder || 'asc',
      }
    }
  }
  // we need to inject the type into the item data
  // as this is not done in the form schema
  const retData = Object.assign({}, data, {
    type,
  })
  // delete the form annotation
  delete(retData.annotation)
  // only include the annotation if there are fields
  if(Object.keys(newAnnotation) <= 0) newAnnotation = null
  return {
    data: retData,
    annotation: newAnnotation,
  }
}

const utils = {
  injectOptionsForm,
  getSaveData,
}

export default utils