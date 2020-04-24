import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'

import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'

import MenuButton from '../widgets/MenuButton'
import icons from '../../icons'

import useDocumentEditor from '../hooks/useDocumentEditor'
import useItemEditor from '../hooks/useItemEditor'

const AddIcon = icons.add
const EditIcon = icons.edit

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
  iconContainer: {
    marginLeft: theme.spacing(0.25),
    marginRight: theme.spacing(0.25),
    //padding: theme.spacing(0.2),
    borderRadius: '16px',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px 0px rgba(0,0,0,0.2)',
  },
  icon: {
    //fontSize: '0.85em',
  },
}))

const EditableDocument = ({
  node,
  layout_id,
  className,
}) => {
  const classes = useStyles()

  const {
    getAddItems,
  } = useDocumentEditor({
    node,
    layout_id,
  })

  const {
    getEditorItems,
  } = useItemEditor({
    node,
  })

  const getEditButton = useCallback((onClick) => {
    return (
      <Tooltip title="Edit" placement="top">
        <IconButton
          size="small"
          onClick={ onClick }
        >
          <EditIcon
            fontSize="inherit"
            className={ classes.icon }
          />
        </IconButton>
      </Tooltip> 
    )
  }, [])


  const getAddButton = useCallback((onClick) => {
    return (
      <Tooltip title="Add" placement="top">
        <IconButton
          size="small"
          onClick={ onClick }
        >
          <AddIcon
            fontSize="inherit"
            color="secondary"
            className={ classes.icon }
          />
        </IconButton>
      </Tooltip> 
    )
  }, [])

  const rootClassname = classnames(classes.root, className)

  return (
    <div className={ rootClassname }>
      <div className={ classnames(classes.iconSection, classes.leftIcons) }>
        <div className={ classes.iconContainer }>
          <MenuButton
            header={ node.name }
            getButton={ getEditButton }
            getItems={ getEditorItems }
          />
        </div>
      </div>
      <div className={ classnames(classes.iconSection, classes.rightIcons) }>
        <div className={ classes.iconContainer }>
          <MenuButton
            noHeader
            getButton={ getAddButton }
            getItems={ getAddItems }
          />
        </div>
      </div>
    </div>
  )
}

export default EditableDocument