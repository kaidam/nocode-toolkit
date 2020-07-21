import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import icons from '../../icons'

import useMenuButton from '../hooks/useMenuButton'
import useDocumentEditor from '../hooks/useDocumentEditor'

const AddIcon = icons.add

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: 'Roboto',
    //padding: theme.spacing(1),
  },
  title: {
    margin: '0px',
  },
  tinyRoot: {
    width: '24px',
    height: '24px',
    minHeight: '24px',
    '& svg': {
      fontSize: '1rem',
    }
  },
}))

const DefaultFolder = ({
  node,
  addContentFilter,
}) => {
  const classes = useStyles()

  const {
    getAddMenu,
  } = useDocumentEditor({
    node,
    addContentFilter,
  })

  const menuButton = useMenuButton({
    getItems: getAddMenu,
  })

  return (
    <div className={ classes.root }>
      <h3 className={ classes.title }>Your Google folder is ready!</h3>
      <p>Any content you add to this folder will appear on this page.</p>
      <div>
        <Button
          color="secondary"
          variant="outlined"
          size="small"
          onClick={ (e) => {
            e.preventDefault()
            e.stopPropagation()
            menuButton.onClick(e)
          }}
        >
          <AddIcon />&nbsp;&nbsp;Add Content
        </Button>
      </div>
      {
        menuButton.menus
      }
    </div>
  )
}

export default DefaultFolder
