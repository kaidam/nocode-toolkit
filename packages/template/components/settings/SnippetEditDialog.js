import React, { useState, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
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
    height: '100%',
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

  const global = snippet.global
  const file = snippet.file

  const [name, setName] = useState(snippet.name)
  const [code, setCode] = useState(snippet.code)
  const [headCode, setHeadCode] = useState(snippet.headCode)
  const [beforeBodyCode, setBeforeBodyCode] = useState(snippet.beforeBodyCode)
  const [afterBodyCode, setAfterBodyCode] = useState(snippet.afterBodyCode)
  const [showErrors, setShowErrors] = useState(false)

  const nameError = name ? null : `Please enter a name`
  let codeError = code ? null : `Please enter some HTML`

  if(global) {
    codeError = !headCode && !beforeBodyCode && !afterBodyCode ? `Please enter some HTML` : null
  }

  const isValid = !nameError && !codeError

  const submitForm = useCallback(() => {
    setShowErrors(isValid ? false : true)
    if(!isValid) return
    onSubmit({
      name,
      global,
      code,
      headCode,
      beforeBodyCode,
      afterBodyCode,
    })
  }, [
    name,
    global,
    file,
    code,
    headCode,
    beforeBodyCode,
    afterBodyCode,
    nameError,
    codeError,
  ])

  let message = `Snippets are chunks of HTML that you can add to pages`

  if(global) message = `Global snippets appear on all pages and are useful for adding script tags or custom CSS`
  else if(file) message = `Upload files that will be published alongside your website`

  let ui = null

  if(global) {
    ui = (
      <React.Fragment>
        <Grid item xs={ 4 }>
          <TextField
            label="Head HTML"
            helperText={ showErrors && codeError ? codeError : "Enter some HTML code for the HEAD tag" }
            fullWidth
            multiline
            rows={ 5 }
            error={ showErrors && codeError ? true : false }
            value={ headCode }
            onChange={(e) => setHeadCode(e.target.value)}
          />
        </Grid>
        <Grid item xs={ 4 }>
          <TextField
            label="Before Body HTML"
            helperText={ showErrors && codeError ? codeError : "Enter some HTML code for before the BODY tag" }
            fullWidth
            multiline
            rows={ 5 }
            error={ showErrors && codeError ? true : false }
            value={ beforeBodyCode }
            onChange={(e) => setBeforeBodyCode(e.target.value)}
          />
        </Grid>
        <Grid item xs={ 4 }>
          <TextField
            label="After Body HTML"
            helperText={ showErrors && codeError ? codeError : "Enter some HTML code for after the BODY tag" }
            fullWidth
            multiline
            rows={ 5 }
            error={ showErrors && codeError ? true : false }
            value={ afterBodyCode }
            onChange={(e) => setAfterBodyCode(e.target.value)}
          />
        </Grid>
      </React.Fragment>
    )
  }
  else if(file) {
    ui = (
      <div>UI HERE</div>
    )
  }
  else {
    ui = (
      <Grid item xs={ 12 }>
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
      </Grid>
    )
  }

  return (
    <Dialog
      open
      onClose={ onClose }
      fullWidth
      maxWidth="lg"
      classes={{
        paper: classes.paper,
      }}
    >
      <DialogTitle>
        { global ? 'Global ' : '' } Snippet
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={ 2 }>

          <Grid item xs={ 12 }>
            <FormHelperText>
              { message }
            </FormHelperText>
          </Grid>

          <Grid item xs={ 12 }>
            <TextField
              label="Name"
              helperText={ showErrors && nameError ? nameError : "Enter the name of the snippet" }
              fullWidth
              error={ showErrors && nameError ? true : false }
              value={ name }
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          {
            ui
          }
        </Grid>
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
