import React, { useState, useEffect, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import SimpleTable from '../table/SimpleTable'
import Actions from '../../utils/actions'
import selectors from '../../store/selectors'
import uiActions from '../../store/modules/ui'

import SettingsDomainsAddDialog from './SettingsDomainsAddDialog'
import SettingsDomainsDeleteDialog from './SettingsDomainsDeleteDialog'

import icons from '../../icons'

const DeleteIcon = icons.delete

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
  urlTitleContainer: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(2),
  },
  urlTableContainer: {
    borderTop: '1px solid #ccc'
  },
}))

const SettingsDomains = ({
  onClose,
}) => {

  const classes = useStyles()

  const actions = Actions(useDispatch(), {
    onSetSubdomain: uiActions.setSubdomain,
    onAddUrl: uiActions.addUrl,
    onRemoveUrl: uiActions.removeUrl,
  })

  const website = useSelector(selectors.ui.website)
  const [subdomain, setSubdomain] = useState('')
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [deleteDialogUrl, setDeleteDialogUrl] = useState(null)
  const [urls, setUrls] = useState([])
  const config = useSelector(selectors.ui.config)
  const nocodeConfig = useSelector(selectors.nocode.config)
  const subdomainValid = subdomain.match(/^[\w-]+$/) ? true : false

  const defaultSubdomain = `website-${nocodeConfig.websiteId}`

  const error = subdomain && !subdomainValid ? true : false
  const saveDisabled = !subdomain || error

  useEffect(() => {
    setSubdomain(website.meta.subdomain || '')
    setUrls(website.meta.urls || [])
  }, [website])

  const onOpenAddDialog = useCallback(() => {
    setAddDialogOpen(true)
  }, [])

  const onCloseAddDialog = useCallback(() => {
    setAddDialogOpen(false)
  }, [])

  const urlFields = [{
    title: 'URL',
    name: 'url',
  }]

  const urlData = urls.map(url => {
    return {
      id: url,
      url: url,
    }
  })

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
        <Grid container className={ classes.urlTitleContainer }>
          <Grid item xs={ 12 }>
            <Typography variant="h6">Custom Domains</Typography>
          </Grid>
        </Grid>
        <Grid container className={ classes.urlTableContainer }>
          <Grid item xs={ 12 }>
            <SimpleTable
              hideHeader
              data={ urlData }
              fields={ urlFields }
              getActions={ (item) => (
                <IconButton
                  onClick={ () => setDeleteDialogUrl(item.url) }
                >
                  <DeleteIcon />
                </IconButton>
              )}
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={ 4 }>
            <Button
              className={ classes.subdomainButton }
              size="small"
              color="secondary"
              variant="contained"
              onClick={ onOpenAddDialog }
            >
              Add custom domain
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
      {
        addDialogOpen && (
          <SettingsDomainsAddDialog
            onSubmit={ url => {
              actions.onAddUrl({
                url,
                onComplete: onCloseAddDialog
              })
            }}
            onClose={ onCloseAddDialog }
          />
        )
      }
      {
        deleteDialogUrl && (
          <SettingsDomainsDeleteDialog
            url={ deleteDialogUrl }
            onConfirm={ () => {
              actions.onRemoveUrl({
                url: deleteDialogUrl,
              })
              setDeleteDialogUrl(null)
            }}
            onClose={ () => setDeleteDialogUrl(null) }
          />
        )
      }
    </div>
  )
}

export default SettingsDomains
