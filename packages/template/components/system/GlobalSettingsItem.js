import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'

const useStyles = makeStyles(theme => ({
  list: {
    width: '300px',
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  }
}))

const GlobalSettingsItem = ({
  item,
  setOpen,
}) => {

  const classes = useStyles()

  if(item === '-') {
    return (
      <Divider className={ classes.divider } />
    )
  }

  return (
    <ListItem
      button
      onClick={ () => {
        if(item.handler) item.handler()
        setOpen(false)
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

export default GlobalSettingsItem
