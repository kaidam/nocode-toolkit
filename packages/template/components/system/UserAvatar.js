import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import userUtils from '../../utils/user'

import Icon from './UserIcon'

const useStyles = makeStyles((theme) => ({
  avatarWrapper: {
    display: 'flex',
  },
  avatarName: {
    flex: 1,
    margin: theme.spacing(1),
    textTransform: ['none', '!important'],
    color: theme.palette.text.primary,
  },
}))

const UserAvatar = ({
  user,
  noName,
  noIcon,
}) => {
  const classes = useStyles()

  const name = user && !noName ? (
    <Typography 
      variant="body1" 
      className={ classes.avatarName }
    >
      { userUtils.displayName(user) }
    </Typography>
  ) : null

  const icon = noIcon ? null : (
    <Icon 
      user={ user }
    />
  )

  return (
    <div className={ classes.avatarWrapper }>
      { icon }
      { name }
    </div>
  )
}

export default UserAvatar