import React, { useState, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

import contentSelectors from '../../../store/selectors/content'

const TagsEditor = ({
  field: {
    name,
    value,
  },
  form: {
    setFieldValue,
  },
  item,
}) => {

  const storeTagSelector = useMemo(contentSelectors.mergedAnnotationArray, [])
  const storeTagData = useSelector(state => storeTagSelector(state, item.field || 'tags'))
  const allTags = useMemo(() => {
    return value.reduce((all, v) => {
      if(all.indexOf(v) < 0) return all.concat([v])
      else return all
    }, storeTagData)
  }, [
    storeTagData,
    value,
  ])

  const [ newTag, setNewTag ] = useState('')

  const onChangeNewTag = useCallback((e) => {
    setNewTag(e.target.value)
  })

  const onAddNewTag = useCallback(() => {
    if(value.indexOf(newTag) < 0) {
      setFieldValue(name, value.concat([newTag]))
    }
    setNewTag('')
  }, [
    value,
    newTag,
  ])

  const onToggleTag = useCallback((tag) => {
    const isChecked = value.indexOf(tag) >= 0
    if(isChecked) {
      setFieldValue(name, value.filter(v => v != tag))
    }
    else {
      setFieldValue(name, value.concat([tag]))
    }
  }, [
    value,
  ])

  return (
    <Grid container spacing={ 2 } alignItems="center">
      <Grid item xs={ 12 }>
        <Typography variant="body1" gutterBottom>
          { item.title }
        </Typography>
        <Typography variant="caption" gutterBottom>
          { item.helperText }
        </Typography>
      </Grid>
      <Grid item xs={ 6 }>
        <div>
          {
            allTags.map((tag, i) => {
              const checked = value.indexOf(tag) >= 0
              return (
                <div key={ tag }>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name={ tag }
                        checked={ checked }
                        onChange={ () => {
                          onToggleTag(tag)
                        }}
                        value={ tag }
                      />
                    }
                    label={ tag }
                  />
                </div>
              )
            })
          }
        </div>
      </Grid>
      <Grid item xs={ 6 }>
        <TextField
          label="New Tag"
          fullWidth
          value={ newTag }
          onChange={ onChangeNewTag }
        />
        <div style={{height:'20px'}}></div>
        <Button
          variant="contained"
          size="small"
          onClick={ onAddNewTag }
        >
          Add New Tag
        </Button>
      </Grid>
    </Grid>
  )
}

export default TagsEditor
