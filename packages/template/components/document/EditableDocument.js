import React, { useContext, useRef, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'

import OnboardingContext from '../contexts/onboarding'
import MenuButton from '../widgets/MenuButton'
import driveUtils from '../../utils/drive'

import useDocumentEditor from '../hooks/useDocumentEditor'
import useItemEditor from '../hooks/useItemEditor'
import useIconButton from '../hooks/useIconButton'
import useMenuButton from '../hooks/useMenuButton'

import eventUtils from '../../utils/events'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: '24px',
    padding: theme.spacing(0.75),
    backgroundColor: theme.palette.grey[200],
    alignItems: 'center',
  },
  iconSection: {
    flexGrow: 0,
    display: 'flex',
    flexDirection: 'row',
  },
  leftIcons: {
    justifyContent: 'flex-start',
  },
  rightIcons: {
    justifyContent: 'flex-end',
  },
  center: {
    flexGrow: 1,
    textAlign: 'center',
  },
  editLink: {
    textDecoration: 'none',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    '& > div': {
      width: '100%',
      height: '100%',
    },
  },
}))

const EditableDocument = ({
  node,
  layout_id,
  className,
  addContentFilter,
  widgetTitleAppend = '',
  quickstart = false,
}) => {

  const editButtonRef = useRef(null)
  const addWidgetsRef = useRef(null)
  const addContentRef = useRef()
  const classes = useStyles()
  const context = useContext(OnboardingContext)

  const isFolder = driveUtils.isFolder(node)
  const openUrl = driveUtils.getItemUrl(node)

  const {
    getAddItems,
    getAddContentItems,
  } = useDocumentEditor({
    node,
    layout_id,
    addContentFilter,
  })

  const {
    getEditorItems,
  } = useItemEditor({
    node,
  })

  const menuButton = useMenuButton({
    getItems: getAddContentItems,
    attachAnchorEl: addContentRef.current,
  })

  const getEditButton = useIconButton({
    icon: 'edit',
    title: `${node.name} : Settings`,
  })

  const getAddButton = useIconButton({
    icon: 'add',
    title: `${node.name} : ${driveUtils.isFolder(node) ? "Add" : "Widgets" + widgetTitleAppend}`,
    color: 'secondary',
    useRef: addWidgetsRef,
  })

  const rootClassname = classnames(classes.root, className)

  useEffect(() => {
    if(!quickstart) return
    context.setFocusElements({
      editDocument: {
        id: 'editDocument',
        ref: editButtonRef,
        padding: 10,
      },
      addWidgets: {
        id: 'addWidgets',
        ref: addWidgetsRef,
        padding: 10,
      },
    })
  }, [])
  
  return (
    <div className={ rootClassname }>
      <div className={ classnames(classes.iconSection, classes.leftIcons) }>
        <MenuButton
          header={ `${node.name} : Settings` }
          getButton={ getEditButton }
          getItems={ getEditorItems }
        />
      </div>
      <div className={ classes.center }>
        {
          isFolder ? (
            <a
              href="#"
              target="_blank"
              className={ classes.editLink }
              onClick={ (e) => {
                eventUtils.cancelEvent(e)
                menuButton.onClick(e)
              }}
            >
              <div>
                <span ref={ addContentRef }>
                  add content
                </span>
              </div>
            </a>
          ) : (
            <a
              href={ openUrl }
              target="_blank"
              className={ classes.editLink }
              onClick={ (e) => {
                context.progressOnboarding()
              }}
            >
              <div>
                <span ref={ editButtonRef }>
                  edit document
                </span>
              </div>
            </a>
          )
        }
        {
          menuButton.menus
        }
      </div>
      <div className={ classnames(classes.iconSection, classes.rightIcons) }>
        <MenuButton
          header={ `${node.name} : ${driveUtils.isFolder(node) ? "Add" : "Widgets"}` }
          getButton={ getAddButton }
          getItems={ getAddItems }
        />
      </div>
    </div>
  )
}

export default EditableDocument