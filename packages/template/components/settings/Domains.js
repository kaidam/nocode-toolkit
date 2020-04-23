import React, { useState, useEffect, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'

import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import SimpleTable from '../table/SimpleTable'
import Actions from '../../utils/actions'

import nocodeSelectors from '../../store/selectors/nocode'
import systemSelectors from '../../store/selectors/system'
import systemActions from '../../store/modules/system'

import DomainsAddDialog from './DomainsAddDialog'
import DomainsDeleteDialog from './DomainsDeleteDialog'

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
    padding: theme.spacing(2),
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
  listContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    height: "100%",
    overflowY: 'auto',
  },
  listCell: {
    flexGrow: 1,
    width: '50%',
  },
  subdomainPadding: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  }
}))

const getSubdomainError = (subdomain, defaultSubdomain) => {
  if(!subdomain.match(/^[\w-]+$/)) return `Only letters, numbers and dashes allowed`
  if(subdomain.match(/^website-\d+$/) && subdomain != defaultSubdomain) return `You cannot use that format`
  return null
}

const SettingsDomains = ({
  onClose,
}) => {

  const classes = useStyles()

  const actions = Actions(useDispatch(), {
    onSetSubdomain: systemActions.setSubdomain,
    onAddUrl: systemActions.addUrl,
    onRemoveUrl: systemActions.removeUrl,
  })

  const config = useSelector(nocodeSelectors.config)
  const systemConfig = useSelector(systemSelectors.config)
  const website = useSelector(systemSelectors.website)
  
  const defaultSubdomain = `website-${config.websiteId}`
  const [subdomain, setSubdomain] = useState(defaultSubdomain)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [deleteDialogUrl, setDeleteDialogUrl] = useState(null)
  const [urls, setUrls] = useState([])
  
  const errorText = getSubdomainError(subdomain, defaultSubdomain)
  
  const error = subdomain && errorText ? true : false
  const saveDisabled = !subdomain || error

  useEffect(() => {
    if(website.meta.subdomain) {
      setSubdomain(website.meta.subdomain || '')
    }
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
        <div className={ classes.listContainer }>
          <div className={ classes.listCell }>
            <Grid container>
              <Grid item xs={ 6 }>
                <TextField
                  label="Subdomain"
                  placeholder={ defaultSubdomain }
                  helperText={ error ? errorText : "" }
                  fullWidth
                  error={ error ? true : false }
                  value={subdomain || ''}
                  onChange={(e) => setSubdomain(e.target.value)}
                />
              </Grid>
              <Grid item xs={ 6 } className={ classes.fullDomain }>
                <Typography>
                  .{ systemConfig.main_domain }
                </Typography>
              </Grid>
              <Grid item xs={ 12 } className={ classes.subdomainPadding }>
                <Typography variant="caption">Enter the subdomain your website will be published to</Typography>
              </Grid>
              <Grid item xs={ 12 }>
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
          <div className={ classes.listCell }>
            <Grid container>
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
              <Grid item xs={ 12 }>
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
        </div>
      </div>
      {
        addDialogOpen && (
          <DomainsAddDialog
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
          <DomainsDeleteDialog
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
