import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

import GoogleDriveLogo from '../icons/GoogleDriveLogo'
import MyDriveLogo from '../icons/MyDriveLogo'
import SharedWithMeLogo from '../icons/SharedWithMeLogo'
import icons from '../../icons'

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
  tab,
  onOpenTab,
}) => {
  const classes = useStyles()
  return (
    <div className={ classes.root }>
      <div className={ classes.titleContainer }>
        <GoogleDriveLogo /> <span className={ classes.driveTitle }>Drive</span>
      </div>
      <Fab variant="extended" className={ classes.addButton } onClick={ () => {} }>
        <AddIcon className={ classes.extendedIcon } />
        New
      </Fab>
      <Divider />
      <div className={ classes.tabsContainer }>
        <List component="nav">
          <ListItem
            button
            selected={ tab == 'root' }
            onClick={ () => onOpenTab('root') }
          >
            <ListItemIcon className={ classes.grey }>
              <MyDriveLogo />
            </ListItemIcon>
            <ListItemText className={ classes.grey } primary="My Drive" />
          </ListItem>
          <ListItem
            button
            selected={ tab == 'shared' }
            onClick={ () => onOpenTab('shared') }
          >
            <ListItemIcon className={ classes.grey }>
              <SharedWithMeLogo />
            </ListItemIcon>
            <ListItemText className={ classes.grey } primary="Shared with me" />
          </ListItem>
        </List>
      </div>
      <Divider />
    </div>
  )
}

export default DriveSidebar