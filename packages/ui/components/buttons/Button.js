import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab'
import icons from '../../icons'

const variants = {
  default: Button,
  fab: Fab,
}

const useStyles = makeStyles({
  smallButton: {
    width: '30px',
    height: '30px',
    minHeight: '30px',
  },
  smallIcon: {
    width: '20px',
    height: '20px',
  }
})

const UIButton = ({
  variant = 'button',
  icon,
  small,
  color = 'secondary',
  onClick,
}) => {
  const classes = useStyles()
  const ButtonComponent = variants[variant] || variants.default
  const ButtonIcon = icon || icons.settings

  return (
    <ButtonComponent
      className={ small ? classes.smallButton : null }
      size='small'
      color={ color }
      onClick={ onClick }
    >
      <ButtonIcon 
        className={ small ? classes.smallIcon : null }
      />
    </ButtonComponent>
  )
}

export default UIButton