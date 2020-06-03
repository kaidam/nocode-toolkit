import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import icons from '../../icons'

const useStyles = makeStyles(theme => ({
  iconContainer: {
    borderRadius: '16px',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px 0px rgba(0,0,0,0.2)',
  },
}))

const useIconButton = ({
  icon,
  title,
  color = 'inherit',
  useRef,
}) => {
  const classes = useStyles()
  const getAddButton = useCallback((onClick) => {
    const Icon = icons[icon]
    return (
      <div className={ classes.iconContainer } ref={ useRef }>
        <Tooltip title={ title } placement="top">
          <IconButton
            size="small"
            onClick={ onClick }
          >
            <Icon
              fontSize="inherit"
              color={ color }
            />
          </IconButton>
        </Tooltip>
        
      </div>
      
    )
  }, [
    icon,
    title,
    classes,
    color,
  ])

  return getAddButton
}

export default useIconButton