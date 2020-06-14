import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'

import Toolbar from '../widgets/Toolbar'

import driveUtils from '../../utils/drive'
import icons from '../../icons'

import contentSelectors from '@nocode-works/template/store/selectors/content'

const EditIcon = icons.edit
const AddIcon = icons.add
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
}) => {
  const classes = useStyles()

  const {
    node,
  } = useSelector(contentSelectors.document)

  const isFolder = driveUtils.isFolder(node)
  const openUrl = driveUtils.getItemUrl(node)

  return (
    <Toolbar>
      <div className={ className }>
        <div className={ classes.container }>
          <div className={ classes.left }>
            {
              node.type != 'folder' && (
                <Button
                  className={ classes.button }
                  size="small"
                >
                  <EditIcon className={ classes.icon } />&nbsp;&nbsp;Edit Document
                </Button>
              )
            }
          </div>
          <div className={ classes.filler }></div>
          <div className={ classes.right }>
            <Button
              className={ classes.button }
              size="small"
            >
              <AddIcon className={ classes.icon } />&nbsp;&nbsp;Add
            </Button>
            <Divider
              className={ classes.divider }
              orientation="vertical"
            />
            <Button
              className={ classes.button }
              size="small"
            >
              <SettingsIcon className={ classes.icon } />&nbsp;&nbsp;Settings
            </Button>
          </div>
        </div>
      </div>
    </Toolbar>
  )
}

export default EditableDocumentToolbar