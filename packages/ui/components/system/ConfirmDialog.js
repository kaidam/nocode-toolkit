import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import Actions from '../../utils/actions'
import uiActions from '../../store/modules/ui'

const useStyles = makeStyles(theme => createStyles({
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

const ConfirmDialog = ({

}) => {
  const classes = useStyles()
  const confirmWindow = useSelector(state => state.ui.confirmWindow)
  const title = confirmWindow ? confirmWindow.title : ''
  const message = confirmWindow ? confirmWindow.message : ''

  const actions = Actions(useDispatch(), {
    onCancel: uiActions.cancelConfirmWindow,
    onConfirm: uiActions.acceptConfirmWindow,
  })

  return (
    <Dialog
      open
      onClose={ actions.onCancel }
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
        <Typography>
          { message }
        </Typography>
      </DialogContent>
      <DialogActions>
        <div className={ classes.buttonsContainer }>
          <div className={ classes.buttonsRight }>
            <Button
              className={ classes.button }
              type="button"
              variant="contained"
              onClick={ actions.onCancel }
            >
              Cancel
            </Button>
            <Button
              className={ classes.button }
              type="button"
              variant="contained"
              color="primary"
              onClick={ actions.onConfirm }
            >
              Confirm
            </Button>
          </div>
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog