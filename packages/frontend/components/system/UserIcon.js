import React from 'react'
import Avatar from '@material-ui/core/Avatar'

import icons from '../../icons'
import userUtils from '../../utils/user'

const AccountCircle = icons.account

const UserIcon = ({
  user,
}) => {
  return user ? (
    <Avatar src={ userUtils.image(user) } />
  ) : (
    <AccountCircle />
  )
}

export default UserIcon