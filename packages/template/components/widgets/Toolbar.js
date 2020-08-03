import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  toolbar: ({borderTop}) => ({
    flexGrow: 0,
    height: '50px',
    minHeight: '50px',
    backgroundColor: theme.palette.grey[100],
    borderTop: borderTop ? '1px solid rgb(204, 204, 204)' : '',
    borderBottom: '1px solid rgb(204, 204, 204)',
  }),
}))

const Toolbar = ({
  borderTop,
  children,
}) => {
  const classes = useStyles({
    borderTop,
  })
  return (
    <div className={ classes.toolbar }>
      { children }
    </div>
  )
}

export default Toolbar