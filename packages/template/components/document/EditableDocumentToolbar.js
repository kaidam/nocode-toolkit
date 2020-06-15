import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'

import Toolbar from '../widgets/Toolbar'
import MenuButton from '../widgets/MenuButton'
import useDocumentEditor from '../hooks/useDocumentEditor'

import icons from '../../icons'

import contentSelectors from '@nocode-works/template/store/selectors/content'

const EditIcon = icons.edit
const AddIcon = icons.add
const OpenIcon = icons.open
const RemoveIcon = icons.clear
const SettingsIcon = icons.settings

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  left: {
    height: '100%',
    flexGrow: 0,
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  filler: {
    flexGrow: 1,
  },
  right: {
    height: '100%',
    flexGrow: 0,
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginTop: theme.spacing(0.5),
    textTransform: 'none',
    color: theme.palette.grey[600],
  },
  divider: {
    height: '50%',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  icon: {
    fontSize: '16px',
  },
}))

const EditableDocumentToolbar = ({
  className,
  layouts,
  small,
}) => {
  const classes = useStyles()

  const {
    node,
  } = useSelector(contentSelectors.document)

  const {
    isFolder,
    onOpenDrive,
    getAddMenu,
    onAddWidget,
    onRemove,
    onOpenSettings,
  } = useDocumentEditor({
    node,
    layouts,
  })

  const getAddButton = useCallback((onClick) => {
    return (
      <Button
        className={ classes.button }
        size="small"
        onClick={ onClick }
      >
        <AddIcon className={ classes.icon } />&nbsp;&nbsp;Add
      </Button>
    )
  }, [
    classes
  ])

  const getSettingsButton = useCallback((onClick) => {
    return (
      <Button
        className={ classes.button }
        size="small"
        onClick={ onClick }
      >
        <AddIcon className={ classes.icon } />&nbsp;&nbsp;Settings
      </Button>
    )
  }, [
    classes
  ])

  const getSmallMenuItems = useCallback(() => {
    return [{
      title: isFolder ? 'Open Folder' : 'Edit Document',
      icon: isFolder ? OpenIcon : EditIcon,
      handler: onOpenDrive,
    }, {
      title: 'Add',
      icon: AddIcon,
      handler: isFolder ? null : onAddWidget,
      items: isFolder ? getAddMenu() : null,
    }, {
      title: 'Remove',
      icon: RemoveIcon,
      handler: onRemove,
    }, {
      title: 'Settings',
      icon: SettingsIcon,
      handler: onOpenSettings,
    }]
  }, [
    isFolder,
    onOpenDrive,
    getAddMenu,
    onAddWidget,
    onRemove,
    onOpenSettings,
  ])

  if(small) {
    return (
      <Toolbar>
        <div className={ className }>
          <div className={ classes.container }>
            <MenuButton
              getButton={ getSettingsButton }
              getItems={ getSmallMenuItems }
            />
          </div>
        </div>
      </Toolbar>
    )
  }
  else {
    return (
      <Toolbar>
        <div className={ className }>
          <div className={ classes.container }>
            <div className={ classes.left }>
              {
                isFolder ? (
                  <Button
                    className={ classes.button }
                    size="small"
                    onClick={ onOpenDrive }
                  >
                    <OpenIcon className={ classes.icon } />&nbsp;&nbsp;Open Folder
                  </Button>
                ) : (
                  <Button
                    className={ classes.button }
                    size="small"
                    onClick={ onOpenDrive }
                  >
                    <EditIcon className={ classes.icon } />&nbsp;&nbsp;Edit Document
                  </Button>
                )
              }
            </div>
            <div className={ classes.filler }></div>
            <div className={ classes.right }>
              {
                isFolder ? (
                  <MenuButton
                    getButton={ getAddButton }
                    getItems={ getAddMenu }
                  />
                ) : (
                  <Button
                    className={ classes.button }
                    size="small"
                    onClick={ onAddWidget }
                  >
                    <AddIcon className={ classes.icon } />&nbsp;&nbsp;Add
                  </Button>
                )
              }
              
              <Divider
                className={ classes.divider }
                orientation="vertical"
              />
              <Button
                className={ classes.button }
                size="small"
                onClick={ onRemove }
              >
                <RemoveIcon className={ classes.icon } />&nbsp;&nbsp;Remove
              </Button>
              <Divider
                className={ classes.divider }
                orientation="vertical"
              />
              <Button
                className={ classes.button }
                size="small"
                onClick={ onOpenSettings }
              >
                <SettingsIcon className={ classes.icon } />&nbsp;&nbsp;Settings
              </Button>
            </div>
          </div>
        </div>
      </Toolbar>
    )
  }
  
}

export default EditableDocumentToolbar