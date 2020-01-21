import React, { useState, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Checkbox from '@material-ui/core/Checkbox'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
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
  info: {
    marginTop: theme.spacing(2),
  },
  margin: {
    marginTop: theme.spacing(1),
  }
}))

const SettingsSnippetEditDialog = ({
  snippet,
  onSubmit,
  onClose,
}) => {

  const classes = useStyles()

  const [name, setName] = useState(snippet.name)
  const [global, setGlobal] = useState(snippet.global)
  const [code, setCode] = useState(snippet.code)
  const [showErrors, setShowErrors] = useState(false)

  const nameError = name ? null : `Please enter a name`
  const codeError = code ? null : `Please enter some HTML`

  const isValid = !nameError && !codeError

  const submitForm = useCallback(() => {
    setShowErrors(isValid ? false : true)
    if(!isValid) return
    onSubmit({
      name,
      global,
      code,
    })
  }, [
    name,
    global,
    code,
    nameError,
    codeError,
  ])

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
        Snippet
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          helperText={ showErrors && nameError ? nameError : "Enter the name of the snippet" }
          fullWidth
          error={ showErrors && nameError ? true : false }
          value={ name }
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="HTML"
          helperText={ showErrors && codeError ? codeError : "Enter some HTML code for this snippet" }
          fullWidth
          multiline
          rows={ 5 }
          error={ showErrors && codeError ? true : false }
          value={ code }
          onChange={(e) => setCode(e.target.value)}
        />
        <div className={ classes.margin }></div>
        <FormControlLabel
          control={
            <Checkbox
              checked={ global }
              onChange={ (e) => setGlobal(e.target.value) }
              value="yes"
              color="secondary"
            />
          }
          label="Global?"
        />
        <FormHelperText>
          Global snippets appear on all pages and are useful for adding script tags or custom CSS
        </FormHelperText>
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
              disabled={ isValid ? false : true }
              onClick={ submitForm }
            >
              Save
            </Button>
          </div>
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default SettingsSnippetEditDialog
