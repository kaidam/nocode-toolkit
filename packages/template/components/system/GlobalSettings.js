import React, { useState, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Fab from '@material-ui/core/Fab'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'

import useGetGlobalOptions from '../hooks/useGetGlobalOptions'

import icons from '../../icons'

const SettingsIcon = icons.settings

const useStyles = makeStyles(theme => ({
  button: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
    zIndex: 100,
  },
  list: {
    width: '300px',
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  }
}))

const GlobalSettings = ({
  onClick,
}) => {
  const classes = useStyles()
  const [ open, setOpen ] = useState(false)

  const getGlobalOptions = useGetGlobalOptions({
    includeExtra: true,
  })

  const globalOptions = useMemo(() => getGlobalOptions(), [
    getGlobalOptions,
  ])

  return (
    <>
      <div className={ classes.button }>
        <Fab
          size="large"
          color="secondary"
          onClick={ () => setOpen(true) }
        >
          <SettingsIcon />
        </Fab>
      </div>
      <Drawer
        anchor="right"
        open={ open }
        onClose={ () => setOpen(false) }
      >
        <List
          className={ classes.list }
          dense
        >
          {
            globalOptions.map((item, i) => {
              if(item === '-') {
                return (
                  <Divider className={ classes.divider } key={ i } />
                )
              }

              return (
                <ListItem
                  key={ i }
                  button
                  onClick={ () => {
                    if(item.handler) item.handler()
                    setOpen(false)
                  }}
                >
                  {
                    item.icon && (
                      <ListItemIcon>
                        <item.icon />
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
            })
          }
        </List>
      </Drawer>
    </>
  )
}

export default GlobalSettings
