import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => createStyles({
  root: {
    cursor: 'pointer',
    border: '2px dotted rgba(255,255,255,0)',
    transition: 'background-color 200ms linear, border 200ms linear',
    '&:hover': {
      border: '2px dotted #444',
      backgroundColor: '#f5f5f5',
    }
  }
}))


const CellContainer = ({
  children,
}) => {

  const classes = useStyles()
  return (
    <div className={ classes.root }>
      { children }
    </div>
  )
}

export default CellContainer