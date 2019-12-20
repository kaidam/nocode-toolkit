import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'

import Typography from '@material-ui/core/Typography'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Dialog from '@material-ui/core/Dialog'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'

import selectors from '../../store/selectors'
import Actions from '../../utils/actions'
import uiActions from '../../store/modules/ui'


import icons from '../../icons'

import SettingsForm from './SettingsForm'
import SettingsPlugins from './SettingsPlugins'
import SettingsDomains from './SettingsDomains'

const useStyles = makeStyles(theme => ({
  appBar: {
    
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  },
  offset: theme.mixins.toolbar,
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
    height: '100%',
    overflowY: 'auto',
  },
  grow: {
    flexGrow: 1,
  },
}))

const SECTIONS = [{
  id: 'general',
  title: 'General',
  icon: icons.settings,
  renderer: SettingsForm,
},{
  id: 'plugins',
  title: 'Plugins',
  icon: icons.plugin,
  renderer: SettingsPlugins,
},{
  id: 'domain',
  title: 'Domains',
  icon: icons.domain,
  renderer: SettingsDomains,
}]

const SettingsDialog = ({
  
}) => {

  const classes = useStyles()

  const actions = Actions(useDispatch(), {
    onViewSection: (section) => uiActions.updateQueryParams({
      section,
      tab: '',
    }),
    onClose:  uiActions.resetQueryParams,
  })

  const {
    section = 'general',
  } = useSelector(selectors.router.queryParams)

  const activeSection = SECTIONS.find(s => s.id == section)
  const Renderer = activeSection ?
    activeSection.renderer :
    () => <div>no section found for { section }</div>

  return (
    <Dialog
      fullScreen
      open
      onClose={ actions.onClose }
    >
      <div className={ classes.container }>
        <div className={ classes.sidebar }>
          <div className={ classes.sidebarHeader }>
            <AppBar position="static" color="default" className={classes.appBar}>
              <Toolbar>
                <Typography><b>Settings</b></Typography>
                <div className={classes.grow} />
              </Toolbar>
            </AppBar>
          </div>
          <div className={ classes.sidebarContent }>
            <List>
              {SECTIONS.map((sectionData, index) => (
                <ListItem
                  key={index}
                  button
                  selected={ sectionData.id == section }
                  onClick={ () => actions.onViewSection(sectionData.id) }
                >
                  <ListItemIcon><sectionData.icon /></ListItemIcon>
                  <ListItemText primary={sectionData.title} />
                </ListItem>
              ))}
            </List>
          </div>  
        </div>
        <div className={ classes.content }>
          <Renderer
            onClose={ actions.onClose }
          />
        </div>
      </div>
    </Dialog>
  )
}

export default SettingsDialog
