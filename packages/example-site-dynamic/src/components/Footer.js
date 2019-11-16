import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Link } from '@nocodesites/utils'

import styles from '../styles/footer'

class Footer extends React.Component {

  render() {
    const {
      classes,
      websiteSettings,
    } = this.props

    return (
      <Grid container spacing={32}>
        <Grid item xs={12} sm={6}>
          <div className={ classes.gridItem }>
            <Typography
              variant="body1"
              color="textSecondary"
            >
              Copyright © { config.company }
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className={ classes.gridItem }>
          </div>
        </Grid>
      </Grid>
    )
  }   
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Footer)