import React, { useCallback, useMemo } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

import AddContentButton from '../../buttons/AddContent'

import GoogleDriveLogo from '../../../styles/GoogleDriveLogo'
import MyDriveLogo from '../../../styles/MyDriveLogo'
import SharedWithMeLogo from '../../../styles/SharedWithMeLogo'
import icons from '../../../icons'

const AddIcon = icons.add

const useStyles = makeStyles(theme => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  titleContainer: {
    margin: '20px',
    marginLeft: '30px',
    display: 'flex',
  },
  driveTitle: {
    color: '#999',
    display: 'inline-block',
    paddingLeft: '10px',
    paddingTop: '5px',
    fontSize: '1.3em',
    fontWeight: 'bold',
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

const DriveSidebar = ({
  driver,
  parent,
  search,
  finderConfig,
  onOpenTab,
}) => {

  const classes = useStyles()

  const titleComponent = useMemo(() => {
    return (
      <div className={ classes.titleContainer }>
        <GoogleDriveLogo /> <span className={ classes.driveTitle }>Drive</span>
      </div>
    )
  }, [])

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
      { titleComponent }
      { addButtonComponent }
      <Divider />
      { tabComponent }
      <Divider />
    </div>
  )
}

export default DriveSidebar