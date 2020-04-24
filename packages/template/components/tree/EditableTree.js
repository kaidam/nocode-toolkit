import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import MenuButton from '../widgets/MenuButton'
import icons from '../../icons'

import useSectionEditor from '../hooks/useSectionEditor'

const SettingsIcon = icons.settings
const AddIcon = icons.add

const useStyles = makeStyles(theme => ({
  root: {
    borderTop: '1px solid #cccccc',
    borderBottom: '1px solid #cccccc',
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.palette.grey[100],
  },
  list: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
  },
  menuItem: {
    paddingLeft: theme.spacing(0), 
    paddingRight: theme.spacing(1),
    //marginTop: theme.spacing(0.2),
    //marginBottom: theme.spacing(0.2),
    cursor: 'pointer',
    color: theme.palette.grey[600],
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    flexGrow: 1,
    marginTop: '2px',
    marginLeft: theme.spacing(1),
    color: theme.palette.text.main,
  },
  itemTextTypography: {
    fontWeight: 'bold',
  },
  settingsIcon: {
    color: theme.palette.text.main,
  },
}))

const EditableTree = ({
  section,
}) => {
  const classes = useStyles()

  const {
    ghostFolder,
    getAddItems,
    getSettingsItems,
  } = useSectionEditor({
    section,
  })

  const ghostFolderTitle = (ghostFolder ? ghostFolder.name : '')
    .replace(/^(\w)/, (st) => st.toUpperCase())

  const getTitleSettingsButton = useCallback((onClick) => {
    return (
      <ListItemText
        classes={{
          primary: classes.itemTextTypography,
        }}
        primary={ ghostFolderTitle }
        onClick={ onClick }
      />
    )
  }, [
    classes,
    ghostFolderTitle,
  ])

  const getAddButton = useCallback((onClick) => {
    return (
      <IconButton
        size="small"
        onClick={ onClick }
      >
        <AddIcon
          fontSize="inherit"
          color="secondary"
        />
      </IconButton>
    )
  }, [])


  const getSettingsButton = useCallback((onClick) => {
    return (
      <IconButton
        size="small"
        onClick={ onClick }
      >
        <SettingsIcon
          fontSize="inherit"
          className={ classes.settingsIcon }
        />
      </IconButton>
    )
  }, [
    classes,
  ])

  return (
    <div className={ classes.root }>
      <List className={ classes.list }>
        <ListItem
          dense
          className={ classes.menuItem }
        >
          <MenuButton
            header={ ghostFolderTitle }
            getButton={ getSettingsButton }
            getItems={ getSettingsItems }
          />
          <MenuButton
            className={ classes.itemText }
            header={ ghostFolderTitle }
            getButton={ getTitleSettingsButton }
            getItems={ getSettingsItems }
          />
          <MenuButton
            header={ ghostFolder ? `${ghostFolderTitle} : Add` : '' }
            getButton={ getAddButton }
            getItems={ getAddItems }
          />
        </ListItem>
      </List>
    </div>
  )
}

export default EditableTree