import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import GoogleButton from 'react-google-button'

import Window from '../dialog/Window'

import {
  GOOGLE_LOGIN,
} from '../../config'

const useStyles = makeStyles(theme => {
  return {
    googleButton: {
      marginTop: theme.spacing(2),
    },
  }
})

const DriveAccessRequestModal = ({

}) => {
  const classes = useStyles()
  const onSubmit = useCallback(() => {
    document.location = GOOGLE_LOGIN
  }, [])

  return (
    <Window
      open
      title="Drive Access Required"
      fullHeight
      size="md"
    >
      <Typography gutterBottom>We require access to your Google Drive to proceed.</Typography>
      <div className={ classes.googleButton }>
        <GoogleButton
          type="dark"
          onClick={ onSubmit }
        />
      </div>
      
    </Window>
  )
}

export default DriveAccessRequestModal