import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import Actions from '../../utils/actions'
import selectors from '../../store/selectors'
import uiActions from '../../store/modules/ui'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  tabs: {
    flexGrow: 0,
  },
  content: {
    padding: theme.spacing(5),
    flexGrow: 1,
    overflowY: 'auto',
  },
  appbar: {
    flexGrow: 0,
  },
  grow: {
    flexGrow: 1,
  },
  subdomainButton: {
    marginTop: theme.spacing(1),
  },
  fullDomain: {
    paddingTop: '26px',
  },
}))

const SettingsDomains = ({
  onClose,
}) => {

  const classes = useStyles()

  const actions = Actions(useDispatch(), {
    onSetSubdomain: uiActions.setSubdomain,
  })

  const website = useSelector(selectors.ui.website)
  const [subdomain, setSubdomain] = useState('')
  const config = useSelector(selectors.ui.config)
  const nocodeConfig = useSelector(selectors.nocode.config)
  const subdomainValid = subdomain.match(/^[\w-]+$/) ? true : false

  const defaultSubdomain = `website-${nocodeConfig.websiteId}`

  const error = subdomain && !subdomainValid ? true : false
  const saveDisabled = !subdomain || error

  useEffect(() => {
    setSubdomain(website.meta.subdomain || '')
  }, [website])

  return (
    <div className={ classes.container }>
      <div className={ classes.content }>
        <Grid container>
          <Grid item xs={ 4 }>
            <TextField
              label="Subdomain"
              placeholder={ defaultSubdomain }
              helperText={ error ? "Please only letters and numbers " : "Enter the subdomain your website will be published to" }
              fullWidth
              error={ error ? true : false }
              value={subdomain || ''}
              onChange={(e) => setSubdomain(e.target.value)}
            />
          </Grid>
          <Grid item xs={ 8 } className={ classes.fullDomain }>
            <Typography>
              .{ config.main_domain }
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={ 4 }>
            <Button
              className={ classes.subdomainButton }
              size="small"
              color={ saveDisabled ? "default" : "secondary" }
              variant="contained"
              disabled={ saveDisabled }
              onClick={ () => actions.onSetSubdomain(subdomain) }
            >
              Update Subdomain
            </Button>
          </Grid>
        </Grid>
      </div>
      <div className={ classes.appbar }>
        <AppBar color="default" position="relative">
          <Toolbar>
            <div className={classes.grow} />
            <Button
              color="default"
              variant="contained"
              onClick={ onClose }
            >
              Close
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    </div>
  )
}

export default SettingsDomains
