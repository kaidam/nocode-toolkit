import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => createStyles({
  root: {
    cursor: 'pointer',
    border: '2px dotted rgba(255,255,255,0)',
    transition: 'background-color 200ms linear, border 200ms linear',
    '&:hover': {
      border: '2px dotted #999',
      backgroundColor: '#f5f5f5',
    }
  },
  activeRoot: {
    border: ['2px solid #999', '!important'],
    backgroundColor: ['#f5f5f5', '!important'],
  },
}))


const CellContainer = ({
  isActive,
  onSelect,
  children,
}) => {
  const classes = useStyles()
  const className = [
    classes.root,
    isActive ? classes.activeRoot : null
  ].filter(c => c).join(' ')
  return (
    <div
      className={ className }
      onClick={ onSelect }
    >
      { children }
    </div>
  )
}

export default CellContainer