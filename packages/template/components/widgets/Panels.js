import React, { useState, useCallback, useMemo } from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'

import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import PanelBody from './PanelBody'

const useStyles = makeStyles(theme => ({
  appBar: {
    
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  },
  sidebar: ({showTitles}) => ({
    width: showTitles ? '300px' : '58px',
    minWidth: showTitles ? '300px' : '58px',
    flexGrow: 0,
    height: '100%',
    borderRight: '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
  }),
  sidebarTitle: {
    flexGrow: 0,
  },
  sidebarContent: {
    flexGrow: 1,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  content: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
}))

/*

  tabs is an array of:

   * id
   * title
   * element
   
  we pass already rendered elements so we reset forms

*/
const PanelsWrapper = ({
  title,
  panels,
  header,
  body,
  footer,
  current,
  autoScroll = true,
  showMenu = true,
  showTitles = true,
  theme = {},
  onChange,
}) => {
  const classes = useStyles({
    showTitles,
  })

  if(!panels || panels.length <= 0) return null

  let currentPanel = panels.find(panel => panel.id == current)
  currentPanel = currentPanel || panels[0]

  const currentPanelAutoScroll = typeof(currentPanel.autoScroll) === 'boolean' ?
    currentPanel.autoScroll :
    autoScroll

  return (
    <div className={ classes.container }>
      {
        showMenu && (
          <div className={ classes.sidebar }>
            {
              title && (
                <div className={ classes.sidebarHeader }>
                  <AppBar position="static" color="default" className={ classes.appBar }>
                    <Toolbar>
                      <Typography><b>{ title }</b></Typography>
                      <div className={classes.grow} />
                    </Toolbar>
                  </AppBar>
                </div>
              )
            }
            <div className={ classes.sidebarContent }>
              <List>
                {
                  panels.map((panel, i) => {

                    const content = (
                      <ListItem
                        key={ i }
                        button
                        selected={ panel.id == current }
                        onClick={ () => onChange(panel.id) }
                      >
                        <ListItemIcon><panel.icon /></ListItemIcon>
                        {
                          showTitles && (
                            <ListItemText primary={ panel.title } />
                          )
                        }
                      </ListItem>
                    )

                    return showTitles ? content : (
                      <Tooltip title={ panel.title } key={ i }>
                        { content }
                      </Tooltip>
                    )
                  })
                }
              </List>
            </div>  
          </div>
        )
      }
      <div className={ classes.content }>
        <PanelBody
          autoScroll={ currentPanelAutoScroll }
          header={ header }
          footer={ footer }
          theme={ theme }
        >
          { body }
        </PanelBody>
      </div>
    </div>
  )
  
}

export default PanelsWrapper