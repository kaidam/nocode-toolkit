import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import icons from '../../icons'

const useStyles = makeStyles(theme => ({
  icon: ({fontSize}) => ({
    fontSize,
  }),
  iconContainer: ({
    borderRadius,
    padding,
  }) => ({
    borderRadius,
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px 0px rgba(0,0,0,0.2)',
    padding,
  }),
}))

const useIconButton = ({
  icon,
  title,
  color = 'inherit',
  useRef,
  fontSize,
  borderRadius = '16px',
  padding = 0,
}) => {
  const classes = useStyles({
    fontSize,
    borderRadius,
    padding,
  })
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
              className={ classes.icon }
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

//className={ classes.icon }