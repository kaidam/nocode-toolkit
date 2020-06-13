import React from 'react'
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

const NocodeIconButton = ({
  icon,
  title,
  color = 'inherit',
  useRef,
  fontSize,
  borderRadius = '16px',
  padding = 0,
  settingsButton = false,
  onClick,
}) => {
  const classes = useStyles({
    fontSize,
    borderRadius,
    padding,
  })
  title = settingsButton ? `${title ? title + ' : ' : ''}Settings` : title
  icon = settingsButton ? 'settings' : icon
  color = settingsButton ? 'secondary' : color
  const Icon = icons[icon]
  return (
    <div className={ classes.iconContainer } ref={ useRef }>
      <Tooltip title={ title } placement="top" arrow>
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
}

export default NocodeIconButton