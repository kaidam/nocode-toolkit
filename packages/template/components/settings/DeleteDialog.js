import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'

const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  buttonsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  button: {
    marginLeft: theme.spacing(2),
  },
  buttonsLeft: {
    flexGrow: 0,
  },
  buttonsRight: {
    flexGrow: 1,
    textAlign: 'right',
  },
}))

const DeleteDialog = ({
  title,
  message,
  onSubmit,
  onClose,
}) => {

  const classes = useStyles()

  return (
    <Dialog
      open
      onClose={ onClose }
      fullWidth
      maxWidth="md"
      classes={{
        paper: classes.paper,
      }}
    >
      <DialogTitle>
        { title }
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          { message }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <div className={ classes.buttonsContainer }>
          <div className={ classes.buttonsRight }>
            <Button
              className={ classes.button }
              type="button"
              variant="contained"
              onClick={ onClose }
            >
              Cancel
            </Button>
            <Button
              className={ classes.button }
              type="button"
              variant="contained"
              color="secondary"
              onClick={ onSubmit }
            >
              Delete
            </Button>
          </div>
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog
