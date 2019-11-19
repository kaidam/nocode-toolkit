import React, { useRef, useState, useEffect, useCallback } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'

import Editor from './Editor'

const useStyles = makeStyles(theme => createStyles({
  container: {
    height: '100%',
    maxHeight: '100%',
    padding: theme.spacing(2),
  },
  editorContainer: {
    height: '100%',
    maxHeight: '100%',
  },
}))

const RichTextField = ({
  field: {
    name,
    value,
  },
  form: {
    setFieldValue,
  },
  item,
}) => {
  const classes = useStyles()
  const containerRef = useRef()
  const [ containerHeight, setContainerHeight ] = useState(0)

  useEffect(() => {
    setContainerHeight(containerRef.current.clientHeight)
  }, [containerRef.current])

  const description = item.helperText

  const useContainerHeight = containerHeight ?
    `${containerHeight}px` :
    `100%`

  const updateField = useCallback(value => {
    setFieldValue(name, value)
  }, [name, setFieldValue])

  return (
    <div className={ classes.container }>
      {
        (item.title && !item.noTitle) && (
          <InputLabel 
            htmlFor={ name }
          >
            { item.title || item.id }
          </InputLabel>
        )
      }
      {
        description ? (
          <FormHelperText error={ false } id={ name + "-description" }>
            { description }
          </FormHelperText>
        ) : null
      }
      <div
        className={ classes.editorContainer }
        ref={ containerRef }
        style={{
          height: useContainerHeight,
          maxHeight: useContainerHeight,
        }}
      >
        <Editor
          value={ value }
          onChange={ updateField }
        />
      </div>
    </div>
  )
}

export default RichTextField