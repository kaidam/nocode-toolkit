import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import SelectField from './Select'
import DragDropList from '../../widgets/DragDropList'

import childrenUtils from '../../../utils/children'
import nocodeSelectors from '../../../store/selectors/nocode'

const SortingEditorTypeEditor = ({
  value,
  onChange,
}) => {

  const fieldConfig = useMemo(() => {
    return {
      name: 'sortType',
      value,
      onChange: (e) => onChange(e.target.value),
    }
  }, [value, onChange])

  const item = useMemo(() => ({
    title: 'Sort Contents By',
    helperText: 'Choose the method by which the contents will be sorted',
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
  }), [])

  return (
    <SelectField
      field={ fieldConfig }
      item={ item }
    />
  )
}

const SortingEditorDirectionEditor = ({
  value,
  onChange,
}) => {

  const fieldConfig = useMemo(() => {
    return {
      name: 'order',
      value,
      onChange: (e) => onChange(e.target.value),
    }
  }, [value, onChange])

  const item = useMemo(() => ({
    title: 'Sort Contents Direction',
    helperText: 'Choose the direction the contents will be sorted in',
    options: [{
      title: 'Ascending',
      value: 'asc',
    },{
      title: 'Descending',
      value: 'desc',
    }]
  }), [])
  
  return (
    <SelectField
      field={ fieldConfig }
      item={ item }
    />
  )
}

const SortingEditorDragDropEditor = ({
  id,
  value,
  onChange,
}) => {

  const nodes = useSelector(nocodeSelectors.nodes)

  const items = useMemo(() => {
    const node = nodes[id]
    if(!node) return []
    return childrenUtils
      .getSortedIds(node.children, value)
      .map(id => nodes[id])
  }, [
    nodes,
    value,
    id,
  ])
  return (
    <DragDropList
      items={ items }
      onChange={ onChange }
    />
  )
}

const SortingEditor = ({
  field: {
    name,
    value = {},
    onChange,
    onBlur
  },
  error,
  touched,
  item,
  onSetFieldValue,
}) => {

  const useType = value.type || 'name'
  const useOrder = value.order || 'asc'
  const useIds = value.ids || []
  const editId = value.id

  const onUpdate = (updates = {}) => {
    onSetFieldValue(name, Object.assign({}, value, updates))
  }

  const editor = useMemo(() => {
    return useType == 'manual' ? (
      <SortingEditorDragDropEditor
        id={ editId }
        value={ useIds }
        onChange={ (ids) => onUpdate({ids}) }
      />
    ) : (
      <SortingEditorDirectionEditor
        value={ useOrder }
        onChange={ (order) => onUpdate({order}) }
      />
    )
  }, [value])

  return (
    <Grid container spacing={ 0 }>
      <Grid item xs={ 12 } sm={ 6 }>
        <SortingEditorTypeEditor
          value={ useType }
          onChange={ (type) => onUpdate({type}) }
        />
      </Grid>
      <Grid item xs={ 12 } sm={ 6 }>
        {
          editor
        }
      </Grid>
    </Grid>
  )
}

export default SortingEditor
