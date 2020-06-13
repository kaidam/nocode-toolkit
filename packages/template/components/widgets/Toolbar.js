import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  toolbar: {
    flexGrow: 0,
    height: '39px',
    minHeight: '39px',
    backgroundColor: theme.palette.grey[100],
    borderBottom: '1px solid rgb(204, 204, 204)',
  },
}))

const Toolbar = ({
  children,
}) => {
  const classes = useStyles()
  return (
    <div className={ classes.toolbar }>
      { children }
    </div>
  )
}

export default Toolbar