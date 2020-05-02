import React, { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import Tooltip from '@material-ui/core/Tooltip'
import Fab from '@material-ui/core/Fab'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'

import Actions from '../../utils/actions'
import systemSelectors from '../../store/selectors/system'
import uiSelectors from '../../store/selectors/ui'
import uiActions from '../../store/modules/ui'
import useGetGlobalOptions from '../hooks/useGetGlobalOptions'

import icons from '../../icons'

const SettingsIcon = icons.settings
const CloseIcon = icons.close

const useStyles = makeStyles(theme => ({
  list: {
    width: '300px',
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  }
}))

const GlobalSettings = ({
  className,
}) => {
  const classes = useStyles()

  const actions = Actions(useDispatch(), {
    onSetPreviewMode: uiActions.setPreviewMode,
    onSetSettingsOpen: uiActions.setSettingsOpen,
  })

  const open = useSelector(uiSelectors.settingsOpen)

  const showUI = useSelector(systemSelectors.showUI)
  const onDisablePreview = () => actions.onSetPreviewMode(false)

  const getGlobalOptions = useGetGlobalOptions({
    includeExtra: true,
  })

  const globalOptions = useMemo(() => getGlobalOptions(), [
    getGlobalOptions,
  ])

  return (
    <>
      <div className={ className }>
        <Tooltip title={ showUI ? "Settings" : "Disable Preview" }  placement="bottom" arrow>
          {
            showUI ? (
              <Fab
                size="medium"
                color="secondary"
                onClick={ () => actions.onSetSettingsOpen(true) }
              >
                <SettingsIcon />
              </Fab>
            ) : (
              <Fab
                size="medium"
                color="secondary"
                onClick={ onDisablePreview }
              >
                <CloseIcon />
              </Fab>
            )
          }
        </Tooltip>
      </div>
      <Drawer
        anchor="right"
        open={ open }
        onClose={ () => actions.onSetSettingsOpen(false) }
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
            })
          }
        </List>
      </Drawer>
    </>
  )
}

export default GlobalSettings
