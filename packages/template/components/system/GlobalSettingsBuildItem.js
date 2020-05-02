import React, { useContext, useRef, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'

import OnboardingContext from '../contexts/onboarding'

const useStyles = makeStyles(theme => ({
  list: {
    width: '300px',
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  }
}))

const GlobalSettingsBuildItem = ({
  item,
  setOpen,
}) => {

  const buttonRef = useRef(null)
  const classes = useStyles()
  const context = useContext(OnboardingContext)

  const onClick = () => {
    if(item.handler) item.handler()
    setOpen(false)
  }

  useEffect(() => {
    setTimeout(() => {
      context.setFocusElement({
        id: 'buildButton',
        ref: buttonRef,
        handler: onClick,
      })
    }, 500)
  }, [
    context.currentStep,
  ])

  return (
    <ListItem
      button
      ref={ buttonRef }
      onClick={ () => {
        context.progressOnboarding()
        onClick()
      }}
    >
      {
        item.icon && (
          <ListItemIcon>
            <item.icon color={ item.iconColor || "inherit" } />
          </ListItemIcon>
        )
      }
      {
        item.iconElement && (
          <ListItemIcon>
            { item.iconElement }
          </ListItemIcon>
        )
      }
      <ListItemText 
        primary={ item.title }
        secondary={ item.help }
      />
      {
        item.secondaryIcon && (
          <ListItemSecondaryAction>
            <div className={ classes.smallIcon }>
              <item.secondaryIcon />
            </div>
          </ListItemSecondaryAction>
        )
      }
    </ListItem>
  )
}

export default GlobalSettingsBuildItem
