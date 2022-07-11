import React from 'react'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import MaterialTextField from '@material-ui/core/TextField'

import Form from './Form'

const FormDialog = ({
  values,
  errors,
  fields,
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
        <Form
          values={ values }
          errors={ errors }
          fields={ fields }
        />
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
          color="primary"
          onClick={ onSubmit }
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FormDialog