import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  toolbar: {
    flexGrow: 0,
    height: '39px',
    minHeight: '39px',
    paddingLeft: '8px',
    backgroundColor: 'rgb(245, 245, 245)',
    borderBottom: '1px solid rgb(204, 204, 204)',
  },
}))

const EditableDocumentToolbar = ({
  
}) => {
  const classes = useStyles()
  return (
    <div className={ classes.toolbar }>
      TOOLBAR
    </div>
  )
}

export default EditableDocumentToolbar