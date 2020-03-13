import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'

import settingsSelectors from '../../store/selectors/settings'

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
  }
}))

const SettingsDomainsAddDialog = ({
  onSubmit,
  onClose,
}) => {

  const classes = useStyles()

  const [url, setUrl] = useState('')
  const [touched, setTouched] = useState(false)
  const urlValid = url.match(/^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/igm) ? true : false
  const error = touched && url && !urlValid ? true : false
  const saveDisabled = !url || error

  const dnsInfo = useSelector(settingsSelectors.dnsInfo)

  const ip = dnsInfo ? dnsInfo.address : ''

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
        Add Domain
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Domain"
          placeholder="mycoolwebsite.com"
          helperText={ error ? "Invalid domain name" : "Enter the domain your website will be published to" }
          fullWidth
          error={ error ? true : false }
          value={url || ''}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={() => setTouched(true)}
        />
        <DialogContentText className={ classes.info }>
          You must ensure that the domain name you enter resolves to <b>{ ip }</b>
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
              disabled={ saveDisabled }
              onClick={ () => onSubmit(url) }
            >
              Save
            </Button>
          </div>
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default SettingsDomainsAddDialog
