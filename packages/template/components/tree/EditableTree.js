import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import MenuButton from '../widgets/MenuButton'
import icons from '../../icons'

import useSectionEditor from '../hooks/useSectionEditor'
import useIconButton from '../hooks/useIconButton'
import settingsSelectors from '../../store/selectors/settings'

const EditIcon = icons.edit
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
}))

const EditableTree = ({
  section,
}) => {
  const classes = useStyles()

  const {    
    getAddItems,
    getSettingsItems,
  } = useSectionEditor({
    section,
  })

  const sectionTitle = (section || '')
    .replace(/^(\w)/, (st) => st.toUpperCase())

  const getTitleSettingsButton = useCallback((onClick) => {
    return (
      <ListItemText
        classes={{
          primary: classes.itemTextTypography,
        }}
        primary={ sectionTitle }
        onClick={ onClick }
      />
    )
  }, [
    classes,
    sectionTitle,
  ])

  const getSettingsButton = useIconButton({
    icon: 'edit',
    title: `${sectionTitle} : Settings`,
  })

  const getAddButton = useIconButton({
    icon: 'add',
    title: `${sectionTitle} : Add`,
    color: 'secondary',
  })

  return (
    <div className={ classes.root }>
      <List className={ classes.list }>
        <ListItem
          dense
          className={ classes.menuItem }
        >
          <MenuButton
            header={ `${sectionTitle} : Settings` }
            getButton={ getSettingsButton }
            getItems={ getSettingsItems }
          />
          <MenuButton
            className={ classes.itemText }
            header={ `${sectionTitle} : Settings` }
            getButton={ getTitleSettingsButton }
            getItems={ getSettingsItems }
          />
          <MenuButton
            header={ `${sectionTitle} : Add` }
            getButton={ getAddButton }
            getItems={ getAddItems }
          />
        </ListItem>
      </List>
    </div>
  )
}

export default EditableTree