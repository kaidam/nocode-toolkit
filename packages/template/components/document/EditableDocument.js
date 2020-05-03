import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'

import MenuButton from '../widgets/MenuButton'
import driveUtils from '../../utils/drive'

import useDocumentEditor from '../hooks/useDocumentEditor'
import useItemEditor from '../hooks/useItemEditor'
import useIconButton from '../hooks/useIconButton'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: '24px',
    padding: theme.spacing(0.75),
    backgroundColor: theme.palette.grey[200],
  },
  iconSection: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcons: {
    justifyContent: 'flex-start',
  },
  rightIcons: {
    justifyContent: 'flex-end',
  },
}))

const EditableDocument = ({
  node,
  layout_id,
  className,
  addContentFilter,
  widgetTitleAppend = '',
}) => {
  const classes = useStyles()

  const {
    getAddItems,
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

  const getEditButton = useIconButton({
    icon: 'edit',
    title: 'Edit',
  })

  const getAddButton = useIconButton({
    icon: 'add',
    title: 'Add Widgets' + widgetTitleAppend,
    color: 'secondary',
  })

  const rootClassname = classnames(classes.root, className)
  
  return (
    <div className={ rootClassname }>
      <div className={ classnames(classes.iconSection, classes.leftIcons) }>
        <MenuButton
          header={ node.name }
          getButton={ getEditButton }
          getItems={ getEditorItems }
        />
      </div>
      <div className={ classnames(classes.iconSection, classes.rightIcons) }>
        <MenuButton
          header={ driveUtils.isFolder(node) ? "Add" : "Widgets" }
          getButton={ getAddButton }
          getItems={ getAddItems }
        />
      </div>
    </div>
  )
}

export default EditableDocument