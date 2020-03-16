import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => ({
  buttons: {
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    marginLeft: theme.spacing(2),
  },
}))  

const SettingsPanelButtons = ({
  onSubmit,
  onCancel,
  submitDisabled = false,
  withSubmit = false,
}) => {
  const classes = useStyles()
  return (
    <div className={ classes.buttons }>
      <Button
        className={ classes.button }
        type="button"
        variant="contained"
        onClick={ onCancel }
      >
        Cancel
      </Button>
      {
        withSubmit && (
          <Button
            className={ classes.button }
            type="button"
            variant="contained"
            color="primary"
            disabled={ submitDisabled }
            onClick={ onSubmit }
          >
            Save
          </Button>
        )
      }
    </div>
  )
}

export default SettingsPanelButtons