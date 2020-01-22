import React, { useCallback, useMemo } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

import AddContentButton from '../../buttons/AddContent'

import MyDriveLogo from '../../../styles/MyDriveLogo'
import SharedWithMeLogo from '../../../styles/SharedWithMeLogo'
import icons from '../../../icons'

const AddIcon = icons.add

const useStyles = makeStyles(theme => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  tabsContainer: {
    
  },
  buttonContainer: {

  },
  grey: {
    color: '#666666',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  addButton: {
    marginLeft: '20px',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
  }
}))

const DEFAULT_ARRAY = []

const DriveSidebar = ({
  driver,
  parent,
  search,
  finderConfig,
  tab,
  onOpenTab,
}) => {

  const classes = useStyles()

  const tabComponent = useMemo(() => {
    return (
      <div className={ classes.tabsContainer }>
        <List component="nav">
          <ListItem
            button
            selected={ !parent || parent == 'root' }
            onClick={ () => onOpenTab('root') }
          >
            <ListItemIcon className={ classes.grey }>
              <MyDriveLogo />
            </ListItemIcon>
            <ListItemText className={ classes.grey } primary="My Drive" />
          </ListItem>
          <ListItem
            button
            selected={ parent == 'shared' }
            onClick={ () => onOpenTab('shared') }
          >
            <ListItemIcon className={ classes.grey }>
              <SharedWithMeLogo />
            </ListItemIcon>
            <ListItemText className={ classes.grey } primary="Shared with me" />
          </ListItem>
        </List>
        
        {/* <Tabs
          value={ activeTabIndex }
          indicatorColor="primary"
          textColor="primary"
          orientation="vertical"
          onChange={ onOpenTabHandler }
        >
          {
            tabs.map((tab, i) => {
              return (
                <Tab
                  key={ i }
                  label={ tab.title }
                />
              )
            })
          }
        </Tabs> */}
      </div>
    )
  }, [
    parent,
  ])

  const addButtonComponent = useMemo(() => {
    return (
      <div className={ classes.buttonContainer }>
        <AddContentButton
          stashQueryParams
          filter={ (parentFilter) => parentFilter.indexOf(`${driver}.finder`) >= 0 }
          location={ `finder:${parent || 'root'}` }
          getButton={(onClick) => {
            return (
              <Fab variant="extended" className={ classes.addButton } onClick={ onClick }>
                <AddIcon className={ classes.extendedIcon } />
                New
              </Fab>
            )
          }}
        />
      </div>
      
    )
  }, [
    search,
    finderConfig,
    driver,
    parent,
  ])

  return (
    <div className={ classes.root }>
      { addButtonComponent }
      <Divider />
      { tabComponent }
      <Divider />
    </div>
  )
}

export default DriveSidebar