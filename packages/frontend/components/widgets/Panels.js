import React, { useState, useCallback, useMemo } from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'

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
  sidebar: {
    width: '300px',
    minWidth: '300px',
    flexGrow: 0,
    height: '100%',
    borderRight: '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarTitle: {
    flexGrow: 0,
  },
  sidebarContent: {
    flexGrow: 1,
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
  theme = {},
  onChange,
}) => {
  const classes = useStyles()

  if(!panels || panels.length <= 0) return null

  let currentPanel = panels.find(panel => panel.id == current)
  currentPanel = currentPanel || panels[0]

  const currentPanelAutoScroll = typeof(currentPanel.autoScroll) === 'boolean' ?
    currentPanel.autoScroll :
    autoScroll

  return (
    <div className={ classes.container }>
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
                return (
                  <ListItem
                    key={ i }
                    button
                    selected={ panel.id == current }
                    onClick={ () => onChange(panel.id) }
                  >
                    <ListItemIcon><panel.icon /></ListItemIcon>
                    <ListItemText primary={ panel.title } />
                  </ListItem>
                )
              })
            }
          </List>
        </div>  
      </div>
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


/*

        {
          currentPanel.header && (
            <div className={ classes.contentHeader }>
              { currentPanel.header }
            </div>
          )
        }
        <div className={ contentBodyClassname }>
          { currentPanel.body }
        </div>
        {
          currentPanel.footer && (
            <div className={ classes.contentFooter }>
              { currentPanel.footer }
            </div>
          )
        }

*/