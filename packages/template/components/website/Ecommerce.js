import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import websiteSelectors from '../../store/selectors/website'
import routerSelectors from '../../store/selectors/router'
import ecommerceSelectors from '../../store/selectors/ecommerce'
import ecommerceActions from '../../store/modules/ecommerce'

const IMAGE_URL = 'data:image/png;base64,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'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    paddingTop: theme.spacing(0),
  },
  paper: {
    padding: theme.spacing(4),
  },
  tick: {
    margin: theme.spacing(2),
    fontSize: '5em',
    color: '#43a047',
  },
  stripeButton: {
    marginTop: theme.spacing(2),
    cursor: 'pointer',
  }
}))

const SettingsEcommerce = ({

}) => {

  const classes = useStyles()
  const dispatch = useDispatch()

  const params = useSelector(routerSelectors.params)
  const stripeConnectData = useSelector(ecommerceSelectors.stripeConnectData)

  const onConnect = useCallback(() => {
    dispatch(ecommerceActions.connect())
  })
  
  return (
    <Grid container spacing={ 4 }>
      <Grid item xs={ 6 }>
        <Paper className={ classes.paper }>
          <Grid container spacing={ 0 }>
            <Grid item xs={ 12 }>
              <Typography variant="h6" gutterBottom>Ecommerce</Typography>
            </Grid>
            <Grid item xs={ 12 }>
              {
                stripeConnectData ? (
                  <div>
                    <div className={ classes.tick }>✔</div>
                    <Typography>
                      Your Stripe account is now connected and you can add payment buttons!
                    </Typography>
                  </div>
                ) : (
                  <div>
                    <Typography>
                      If you want to take payments, you must first <strong>connect your stripe account</strong>
                    </Typography>
                    <div
                      className={ classes.stripeButton }
                      onClick={ onConnect }
                    >
                      <img src={ IMAGE_URL } />
                    </div>
                  </div>
                )
              }
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default SettingsEcommerce