import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => createStyles({
  paper: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  fullHeightPaper: {
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
  compactContent: {
    padding: ['0px', '!important'],
  },
  noWindowScroll: {
    overflowX: ['hidden', '!important'],
    overflowY: ['hidden', '!important']
  }
}))   

const Window = ({
  leftButtons,
  rightButtons,
  buttons,
  withCancel,
  loading,
  submitTitle = 'Save',
  cancelTitle = 'Cancel',
  open,
  title,
  size = 'md',
  children,
  compact = false,
  noScroll = false,
  fullHeight = true,
  onCancel,
  onSubmit,
  classNames = {},
}) => {
  const classes = useStyles()

  const headerClassname = [
    classNames.header,
  ].filter(c => c).join(' ')

  const contentClassname = [
    compact ? classes.compactContent : null,
    noScroll ? classes.noWindowScroll : null,
    classNames.content,
  ].filter(c => c).join(' ')

  const paperClassname = [
    classes.paper,
    fullHeight ? classes.fullHeightPaper : null,
    noScroll ? classes.noWindowScroll : null,
    classNames.paper,
  ].filter(c => c).join(' ')

  return (
    <Dialog
      open={ open }
      onClose={ onCancel }
      fullWidth
      maxWidth={ size }
      classes={{
        paper: paperClassname,
      }}
    >
      {
        title && (
          <DialogTitle
            className={ headerClassname }
          >
            { title }
          </DialogTitle>
        )
      }
      <DialogContent
        className={ contentClassname }
      >
        { children }
      </DialogContent>
      <DialogActions>
        <div className={ classes.buttonsContainer }>
          <div className={ classes.buttonsLeft }>
            { leftButtons }
          </div>
          <div className={ classes.buttonsRight }>
            {
              withCancel && (
                <Button
                  className={ classes.button }
                  type="button"
                  variant="contained"
                  onClick={ onCancel }
                >
                  { cancelTitle }
                </Button>
              )
            }
            {
              onSubmit && (
                <Button
                  className={ classes.button }
                  type="button"
                  variant="contained"
                  color="primary"
                  disabled={ loading ? true : false }
                  onClick={ onSubmit }
                >
                  { submitTitle }
                </Button>
              )
            }
            { rightButtons || buttons }
          </div>
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default Window