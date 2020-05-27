import React, { useCallback } from 'react'
import Typography from '@material-ui/core/Typography'
import GoogleButton from 'react-google-button'

import Window from '../dialog/Window'

import {
  GOOGLE_LOGIN,
} from '../../config'

const DriveAccessRequestModal = ({

}) => {
  const onSubmit = useCallback(() => {
    document.location = GOOGLE_LOGIN
  }, [])

  return (
    <Window
      open
      title="Drive Access Required"
      submitTitle="Connect your google drive"
      size="lg"
    >
      <Typography gutterBottom>We require access to your Google Drive to proceed.</Typography>
      <GoogleButton
        type="dark"
        onClick={ onSubmit }
      />
    </Window>
  )
}

export default DriveAccessRequestModal