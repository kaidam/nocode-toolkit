import React from 'react'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import userUtils from 'utils/user'

import Icon from './Icon'

const styles = (theme) => ({
  avatarWrapper: {
    display: 'flex',
  },
  avatarName: {
    flex: 1,
    margin: theme.spacing(1),
    textTransform: ['none', '!important'],
  },
})

class UserAvatar extends React.Component {

  render() {
    const {
      classes,
      user,
      noName,
      noIcon,
    } = this.props

    const name = user && !noName ? (
      <Typography 
        variant="body1" 
        color="inherit" 
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

    if(this.props.iconAlign == 'left') {
      return (
        <div className={ classes.avatarWrapper }>
          { icon }
          { name }
        </div>
      )
    }
    else {
      return (
        <div className={ classes.avatarWrapper }>
          { name }
          { icon }
        </div>
      )
    }    
  }
}

UserAvatar.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(UserAvatar)