import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import MenuButton from '../widgets/MenuButton'
import icons from '../../icons'

import useLayoutEditor from '../hooks/useLayoutEditor'
import useIconButton from '../hooks/useIconButton'

const AddIcon = icons.add
const WidgetIcon = icons.widget

const useStyles = makeStyles(theme => ({
  root: ({
    hasItems,
  }) => ({
    borderBottom: hasItems ? '1px solid #cccccc' : 'none',
    paddingLeft: theme.spacing(1), 
    backgroundColor: theme.palette.grey[100],
  }),
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
    marginLeft: theme.spacing(1),
    marginTop: '2px',
    color: theme.palette.text.main,
  },
  itemTextTypography: {
    
  },
}))

const EditableTreeWidgets = ({
  content_id,
  layout_id,
}) => {
  const {
    data,
    getAddMenu,
  } = useLayoutEditor({
    content_id,
    layout_id
  })

  const classes = useStyles({
    hasItems: data && data.length > 0 ? true : false,
  })

  const getTitleSettingsButton = useCallback((onClick) => {
    return (
      <ListItemText
        classes={{
          primary: classes.itemTextTypography,
        }}
        primary="Widgets"
        onClick={ onClick }
      />
    )
  }, [
    classes,
  ])

  const getWidgetButton = useCallback((onClick) => {
    return (
      <IconButton
        size="small"
        onClick={ onClick }
      >
        <WidgetIcon
          fontSize="inherit"
        />
      </IconButton>
    )
  }, [
    classes,
  ])

  const getAddButton = useIconButton({
    icon: 'add',
    title: 'Add Widgets',
    color: 'secondary',
  })

  return (
    <div className={ classes.root }>
      <List
        className={ classes.list }
      >
        <ListItem
          dense
          className={ classes.menuItem }
        >
          <MenuButton
            header="Widgets : Add"
            getButton={ getWidgetButton }
            getItems={ getAddMenu }
          />
          <MenuButton
            className={ classes.itemText }
            header="Widgets : Add"
            getButton={ getTitleSettingsButton }
            getItems={ getAddMenu }
          />
          <MenuButton
            header="Widgets : Add"
            getButton={ getAddButton }
            getItems={ getAddMenu }
          />
        </ListItem>
      </List>
    </div>
  )
}

export default EditableTreeWidgets