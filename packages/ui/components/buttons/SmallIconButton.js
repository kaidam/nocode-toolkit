import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'

const useStyles = makeStyles({
  tinyRoot: {
    width: '24px',
    height: '24px',
    minHeight: '24px',
    '& svg': {
      fontSize: '1rem',
    }
  }
})

const SmallIconButton = ({
  tiny,
  color,
  Icon,
  tooltip,
  onClick,
}) => {
  const classes = useStyles()
  const content = (
    <Fab
      size="small"
      color={ color || "secondary" }
      className={ tiny ? classes.tinyRoot : null }
      onClick={ onClick }
    >
      <Icon />
    </Fab>
  )

  if(tooltip) {
    return (
      <Tooltip title={ tooltip }>
        { content }
      </Tooltip>
    )
  }
  else {
    return content
  }
}

export default SmallIconButton