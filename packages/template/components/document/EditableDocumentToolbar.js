import React, { useContext, useCallback, useRef, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'

import OnboardingContext from '../contexts/onboarding'
import Toolbar from '../widgets/Toolbar'
import MenuButton from '../widgets/MenuButton'
import useDocumentEditor from '../hooks/useDocumentEditor'

import icons from '../../icons'

import contentSelectors from '../../store/selectors/content'

const EditIcon = icons.edit
const AddIcon = icons.add
const OpenIcon = icons.open
const RemoveIcon = icons.clear
const SettingsIcon = icons.settings
const LayoutIcon = icons.layout

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
  const context = useContext(OnboardingContext)
  const editButtonRef = useRef(null)
  const addButtonRef = useRef(null)

  const {
    node,
  } = useSelector(contentSelectors.document)

  const {
    isFolder,
    onOpenDrive,
    getAddMenu,
    onRemove,
    onOpenSettings,
    onEditLayout,
  } = useDocumentEditor({
    node,
    layouts,
  })

  const getAddButton = useCallback((onClick) => {
    return (
      <Button
        className={ classes.button }
        size="small"
        ref={ addButtonRef }
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
        <SettingsIcon className={ classes.icon } />&nbsp;&nbsp;Settings
      </Button>
    )
  }, [
    classes
  ])

  const getSmallMenuItems = useCallback(() => {
    return [{
      title: isFolder ? 'View Folder' : 'Edit Document',
      icon: isFolder ? OpenIcon : EditIcon,
      handler: onOpenDrive,
    }, isFolder ? {
      title: 'Add',
      icon: AddIcon,
      items: getAddMenu(),
    } : null, {
      title: 'Edit Layout',
      icon: LayoutIcon,
      handler: onEditLayout,
    }, {
      title: 'Settings',
      icon: SettingsIcon,
      handler: onOpenSettings,
    }].filter(i => i)
  }, [
    isFolder,
    onOpenDrive,
    getAddMenu,
    onRemove,
    onOpenSettings,
  ])

  useEffect(() => {
    if(small) return
    context.setFocusElements({
      [`editDocument`]: {
        id: 'editDocument',
        ref: editButtonRef,
      },
    })
  }, [])

  if(small) {
    return (
      <Toolbar>
        <div className={ className }>
          <div className={ classes.container } ref={ editButtonRef }>
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
                    ref={ editButtonRef }
                    onClick={ onOpenDrive }
                  >
                    <OpenIcon className={ classes.icon } />&nbsp;&nbsp;View Folder
                  </Button>
                ) : (
                  <Button
                    className={ classes.button }
                    size="small"
                    ref={ editButtonRef }
                    onClick={ onOpenDrive }
                  >
                    <EditIcon className={ classes.icon } />&nbsp;&nbsp;Edit Document
                  </Button>
                )
              }
              {
                isFolder && (
                  <>
                    <Divider
                      className={ classes.divider }
                      orientation="vertical"
                    />
                    <MenuButton
                      getButton={ getAddButton }
                      getItems={ getAddMenu }
                    />
                  </>
                )
              }
            </div>
            <div className={ classes.filler }></div>
            {
              !node.externallyLoaded && (
                <div className={ classes.right }>
                  <Button
                    className={ classes.button }
                    size="small"
                    onClick={ onEditLayout }
                  >
                    <LayoutIcon className={ classes.icon } />&nbsp;&nbsp;Edit Layout
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
              )
            }
          </div>
        </div>
      </Toolbar>
    )
  }
  
}

export default EditableDocumentToolbar