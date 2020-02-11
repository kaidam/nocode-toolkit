import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import Button from '@material-ui/core/Button'

import icons from '../../icons'

const AddIcon = icons.add
const EditIcon = icons.edit
const SettingsIcon = icons.settings

const useStyles = makeStyles(theme => createStyles({
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

const RenderDefaultDocumentUI = ({
  onClick,
}) => {
  const classes = useStyles()

  return (
    <div
      style={{
        fontFamily: 'Roboto'
      }}
    >
      <h3 className={ classes.title }>Your Google document is ready!</h3>
      <p>Any content you add to this document will appear on this page.</p>
      <p>You can add content to this document by clicking this button:</p>
      <div>
        <Button
          color="secondary"
          variant="contained"
          size="small"
          onClick={ (e) => {
            e.preventDefault()
            e.stopPropagation()
            onClick()
          }}
        >
          <EditIcon />&nbsp;&nbsp;Edit Document
        </Button>
      </div>
    </div>
  )
}

export default RenderDefaultDocumentUI
