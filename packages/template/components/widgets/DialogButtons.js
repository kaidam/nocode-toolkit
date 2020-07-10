import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => ({
  buttons: ({align}) => ({
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: align == 'left' ? 'flex-start' : 'flex-end',
  }),
  button: {
    marginLeft: theme.spacing(2),
  },
}))  

const SettingsPanelButtons = ({
  onSubmit,
  onCancel,
  align = 'right',
  submitDisabled = false,
  withSubmit = false,
  cancelTitle = 'Cancel',
  submitTitle = 'Save'
}) => {
  const classes = useStyles({
    align,
  })
  return (
    <div className={ classes.buttons }>
      <Button
        className={ classes.button }
        type="button"
        variant="contained"
        onClick={ onCancel }
      >
        { cancelTitle }
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
            { submitTitle }
          </Button>
        )
      }
    </div>
  )
}

export default SettingsPanelButtons