import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => createStyles({
  
}))  

const ContactButton = ({
  content,
  cell,
  rowIndex,
  cellIndex,
}) => {

  return (
    <Dialog
      open={ true }
      onClose={ onClose }
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        Purchase complete!
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          You have purchased { content.name } for { content.currencySymbol }{ content.price }.
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
      </DialogActions>
    </Dialog>
  )
}

export default ContactButton