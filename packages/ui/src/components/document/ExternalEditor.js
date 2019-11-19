import React, { useMemo } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import driveUtils from '../../types/drive/utils'
import Window from '../system/Window'
import Loading from '../system/Loading'

const useStyles = makeStyles(theme => createStyles({
  iframe: {
    width: '100%',
    height: '100%',
    margin: '0px',
  },
}))

const CellEditorExternalDrive = ({
  item,
}) => {
  const classes = useStyles()
  const {
    id,
  } = item

  const url = driveUtils.getGoogleLink(driveUtils.getDocumentLink(id))

  return (
    <iframe
      className={ classes.iframe }
      frameBorder="0"
      src={ url }
    />
  )
}

const EditorExternal = ({
  item,
  loading,
  onCancel,
  onSubmit,
}) => {
  const content = useMemo(() => {
    if(loading) {
      return (
        <Loading />
      )
    }
    else if(item.driver == 'drive') {
      return (
        <CellEditorExternalDrive
          item={ item }
        />
      )
    }
    else {
      return null
    }
  }, [item, loading])

  return (
    <Window
      open
      size="lg"
      compact
      noScroll
      loading={ loading }
      onCancel={ onCancel }
      onSubmit={ onSubmit }
    >
      { content }
    </Window>
  )
}

export default EditorExternal