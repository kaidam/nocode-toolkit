import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'

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

const PageSettingsSaveTemplateDialog = ({
  onSave,
  onCancel,
}) => {
  const classes = useStyles()
  
  const [ currentName, setCurrentName ] = useState('')
  const [ isTouched, setIsTouched ] = useState(false)
  
  const hasError = !currentName.match(/\w+/)
  const showError = isTouched && hasError

  return (
    <Dialog
      open
      onClose={ onCancel }
      fullWidth
      maxWidth="md"
      classes={{
        paper: classes.paper,
      }}
    >
      <DialogTitle>
        Save template
      </DialogTitle>
      <DialogContent>
        <TextField
          error={ showError }
          id="template-name"
          label="Template name"
          helperText="Enter the name for your template"
          fullWidth
          value={ currentName }
          onChange={ (e) => setCurrentName(e.target.value) }
          onBlur={ (e) => setIsTouched(true) }
        />
      </DialogContent>
      <DialogActions>
        <div className={ classes.buttonsContainer }>
          <div className={ classes.buttonsRight }>
            <Button
              className={ classes.button }
              type="button"
              variant="contained"
              onClick={ onCancel }
            >
              Cancel
            </Button>
            <Button
              className={ classes.button }
              type="button"
              variant="contained"
              color="primary"
              onClick={ () => onSave(currentName) }
              disabled={ hasError }
            >
              Add Template
            </Button>
          </div>
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default PageSettingsSaveTemplateDialog