import React, { useMemo, useCallback } from 'react'

import Grid from '@material-ui/core/Grid'
import SelectField from '../form/fields/Select'

import SortingEditorList from './SortingEditorList'

const SortingEditorTypeEditor = ({
  itemOptions,
  onSetItemOption,
}) => {

  const fieldConfig = useMemo(() => {
    return {
      name: 'sortType',
      value: itemOptions.sortType,
      onChange: (e) => {
        onSetItemOption({
          name: 'sortType',
          value: e.target.value
        })
      }
    }
  }, [itemOptions, onSetItemOption])

  const item = useMemo(() => {
    return {
      title: 'Sort Children By',
      helperText: 'Choose the method by which the children will be sorted',
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
    }
  }, [])

  return (
    <SelectField
      field={ fieldConfig }
      item={ item }
    />
  )
}

const SortingEditorDirectionEditor = ({
  itemOptions,
  onSetItemOption,
}) => {

  const fieldConfig = useMemo(() => {
    return {
      name: 'sortOrder',
      value: itemOptions.sortOrder,
      onChange: (e) => {
        onSetItemOption({
          name: 'sortOrder',
          value: e.target.value
        })
      }
    }
  }, [itemOptions, onSetItemOption])

  const item = useMemo(() => {
    return {
      title: 'Sort Children Direction',
      helperText: 'Choose the direction the children will be sorted in',
      options: [{
        title: 'Ascending',
        value: 'asc',
      },{
        title: 'Descending',
        value: 'desc',
      }]
    }
  })
  
  return (
    <SelectField
      field={ fieldConfig }
      item={ item }
    />
  )
}

const SortingEditorDragDropEditor = ({
  itemOptions,
  allItems,
  onSetItemOption,
}) => {

  const onUpdate = useCallback((ids) => onSetItemOption({
    name: 'sortIds',
    value: ids,
  }), [onSetItemOption])

  return (
    <SortingEditorList
      ids={ itemOptions.sortIds }
      allItems={ allItems }
      onUpdate={ onUpdate }
    />
  )
}

const SortingEditor = ({
  itemOptions,
  allItems,
  onSetItemOption,
}) => {

  const editor = useMemo(() => {
    return itemOptions.sortType == 'manual' ? (
      <SortingEditorDragDropEditor
        itemOptions={ itemOptions }
        allItems={ allItems }
        onSetItemOption={ onSetItemOption }
      />
    ) : (
      <SortingEditorDirectionEditor
        itemOptions={ itemOptions }
        onSetItemOption={ onSetItemOption }
      />
    )
  }, [itemOptions, allItems, onSetItemOption])

  return (
    <Grid container spacing={ 2 }>
      <Grid item xs={ 12 } sm={ 6 }>
        <SortingEditorTypeEditor
          itemOptions={ itemOptions }
          onSetItemOption={ onSetItemOption }
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
