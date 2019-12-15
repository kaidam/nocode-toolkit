import React from 'react'

import { createStyles, makeStyles } from '@material-ui/core/styles'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => createStyles({
  
}))  

const FormDialog = ({
  content,
  onSubmit,
  onClose,
}) => {

  return (
    <Dialog
      open={ true }
      onClose={ onClose }
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        Contact Form
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          FORM HERE
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          type="button"
          variant="contained"
          onClick={ onClose }
        >
          Close
        </Button>
        <Button
          type="button"
          variant="contained"
          onClick={ onSubmit }
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FormDialog