import React from 'react'
import classnames from 'classnames'

import Typography from '@material-ui/core/Typography'
import Window from './Window'

const defaultContent = (
  <Typography>
    Are you <strong>absolutely sure</strong> you want to delete this item?
  </Typography>
)

const DeleteConfirm = ({
  title = 'Confirm Delete?',
  submitTitle = 'Delete',
  children,
  onConfirm,
  onCancel,
}) => {
  return (
    <Window
      open
      title={ title }
      size="sm"
      withCancel
      submitTitle={ submitTitle }
      onSubmit={ onConfirm }
      onCancel={ onCancel } 
    >
      {
        children || defaultContent
      }
    </Window>
  )
}

export default DeleteConfirm