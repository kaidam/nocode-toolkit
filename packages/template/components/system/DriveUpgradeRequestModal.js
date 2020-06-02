import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import GoogleButton from 'react-google-button'

import Actions from '../../utils/actions'

import driveActions from '../../store/modules/drive'

import Window from '../dialog/Window'

import {
  GOOGLE_UPGRADE_LOGIN,
} from '../../config'

const useStyles = makeStyles(theme => {
  return {
    googleButton: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  }
})

const DriveUpgradeRequestModal = ({

}) => {

  const classes = useStyles()
  const onSubmit = useCallback(() => {
    document.location = GOOGLE_UPGRADE_LOGIN
  }, [])

  const actions = Actions(useDispatch(), {
    onCancel: driveActions.cancelUpgradeWindow,
  })

  return (
    <Window
      open
      title="Full Drive Access Required"
      fullHeight
      withCancel
      size="md"
      onCancel={ actions.onCancel }
    >
      <Typography gutterBottom>
        To perform this action we will need full access to your Google Drive.
      </Typography>
      <Typography gutterBottom>
        Presently - we can only see content you have created with nocode.
      </Typography>
      <Typography gutterBottom>
        Click the button below to login with Google.
      </Typography>
      <div className={ classes.googleButton }>
        <GoogleButton
          type="dark"
          onClick={ onSubmit }
        />
      </div>
      <Typography gutterBottom>
        We will never delete any files or read any content you have not added to this site.
      </Typography>
    </Window>
  )
}

export default DriveUpgradeRequestModal