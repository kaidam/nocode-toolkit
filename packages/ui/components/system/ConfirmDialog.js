import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'

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
  
  const cancelTitle = confirmWindow && confirmWindow.cancelTitle ? confirmWindow.cancelTitle : 'Cancel'
  const confirmTitle = confirmWindow && confirmWindow.confirmTitle ? confirmWindow.confirmTitle : 'Confirm'
  const showCancel = confirmWindow && confirmWindow.hideCancel ? false : true
  const showConfirm = confirmWindow && confirmWindow.hideConfirm ? false : true

  const actions = Actions(useDispatch(), {
    onCancel: () => uiActions.cancelConfirmWindow(),
    onConfirm: () => uiActions.acceptConfirmWindow(),
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
        <div 
          dangerouslySetInnerHTML={{__html: message }}
        >
        </div>
      </DialogContent>
      <DialogActions>
        <div className={ classes.buttonsContainer }>
          <div className={ classes.buttonsRight }>
            {
              showCancel && (
                <Button
                  className={ classes.button }
                  type="button"
                  variant="contained"
                  onClick={ actions.onCancel }
                >
                  { cancelTitle }
                </Button>
              )
            }
            {
              showConfirm && (
                <Button
                  className={ classes.button }
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={ actions.onConfirm }
                >
                  { confirmTitle }
                </Button>
              )
            }
          </div>
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog