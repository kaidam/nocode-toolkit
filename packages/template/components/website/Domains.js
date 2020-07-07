import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import SimpleTable from '../table/SimpleTable'
import DeleteConfirm from '../dialog/DeleteConfirm'
import FormDialog from '../form/Dialog'

import websiteSelectors from '../../store/selectors/website'
import websiteActions from '../../store/modules/website'

import icons from '../../icons'
const DeleteIcon = icons.delete

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    paddingTop: theme.spacing(0),
  },
  paper: {
    padding: theme.spacing(4),
  },
  bottomPaper: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(4),
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
  subdomainPadding: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
  },
  addUrlForm: {
    padding: theme.spacing(0),
  },
  addUrlText: {
    marginTop: theme.spacing(2),
  }
}))

const DOMAIN_INITIAL_VALUES = {
  url: '',
}

const DOMAIN_SCHEMA = [{
  id: 'url',
  title: 'Domain',
  helperText: 'Enter the domain your website will be published to',
  inputProps: {
    placeholder: 'mycoolwebsite.com',
  },
  validate: {
    type: 'string',
    methods: [
      ['required', 'The domain is required'],
    ],
  }
}]

const validateUrlForm = (values) => {
  const errors = {}
  if(!values.url.match(/^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/igm)){
    errors.url = `Please enter a valid URL`
  }
  return errors
}

const getSubdomainError = (subdomain, defaultSubdomain) => {
  if(!subdomain.match(/^[\w-]+$/)) return `Only letters, numbers and dashes allowed`
  if(subdomain.match(/^website-\d+$/) && subdomain != defaultSubdomain) return `You cannot use that format`
  return null
}

const SettingsDomains = ({

}) => {

  const classes = useStyles()
  const dispatch = useDispatch()

  const website = useSelector(websiteSelectors.websiteData)
  const config = useSelector(websiteSelectors.config)
  const dnsInfo = useSelector(websiteSelectors.dnsInfo)

  const defaultSubdomain = `website-${website.id}`
  const [subdomain, setSubdomain] = useState(defaultSubdomain)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [deleteDialogUrl, setDeleteDialogUrl] = useState(null)

  const ip = dnsInfo ? dnsInfo.address : ''
  const urls = (website && website.meta ? website.meta.urls : []) || []
  
  const errorText = getSubdomainError(subdomain, defaultSubdomain)
  
  const error = subdomain && errorText ? true : false
  const saveDisabled = !subdomain || error

  useEffect(() => {
    if(!website) return
    if(website.meta.subdomain) {
      setSubdomain(website.meta.subdomain || '')
    }
  }, [
    website
  ])

  const onSetSubdomain = useCallback((subdomain) => {
    dispatch(websiteActions.setSubdomain({
      id: website.id,
      subdomain,
    }))
  }, [
    website,
  ])

  const onAddUrl = useCallback(async ({
    url,
  }) => {
    const result = await dispatch(websiteActions.addUrl({
      id: website.id,
      url,
    }))
    if(result) setAddDialogOpen(false)
  }, [
    website,
  ])

  const onRemoveUrl = useCallback(async () => {
    const result = await dispatch(websiteActions.removeUrl({
      id: website.id,
      url: deleteDialogUrl,
    }))
    if(result) setDeleteDialogUrl(null)
  }, [
    deleteDialogUrl,
    website,
  ])

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
    <>
      <Grid container spacing={ 4 }>
        <Grid item xs={ 12 } sm={ 12 } md={ 6 }>
          <Paper className={ classes.paper }>
            <Grid container spacing={ 0 }>
              <Grid item xs={ 12 }>
                <Typography variant="h6" gutterBottom>Subdomain</Typography>
              </Grid>
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
                  .{ config.main_domain }
                </Typography>
              </Grid>
              <Grid item xs={ 12 } className={ classes.subdomainPadding }>
                <Typography variant="caption">Enter the subdomain your website will be published to</Typography>
              </Grid>
              <Grid item xs={ 12 }>
                <Button
                  className={ classes.subdomainButton }
                  size="small"
                  color={ saveDisabled ? "default" : "primary" }
                  variant="contained"
                  disabled={ saveDisabled }
                  onClick={ () => onSetSubdomain(subdomain) }
                >
                  Update Subdomain
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={ 12 } sm={ 12 } md={ 6 }>
          <Paper className={ classes.paper }>
            <Grid container spacing={ 0 }>
              <Grid item xs={ 12 }>
                <Typography variant="h6" gutterBottom>Custom Domains</Typography>
              </Grid>

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
                  color="primary"
                  variant="contained"
                  onClick={ () => setAddDialogOpen(true) }
                >
                  Add custom domain
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      {
        addDialogOpen && (
          <FormDialog
            title="Add Domain"
            size="md"
            schema={ DOMAIN_SCHEMA }
            initialValues={ DOMAIN_INITIAL_VALUES }
            formProps={{
              validate: validateUrlForm,
            }}
            renderProps={{
              spacing: 0,
              theme: {
                root: classes.addUrlForm,
              }
            }}
            withCancel
            onSubmit={ onAddUrl }
            onCancel={ () => setAddDialogOpen(false) }
          >
            <div className={ classes.addUrlText }>
              <Typography gutterBottom>
                You must configure the DNS settings with your domain provider to make this work.
              </Typography>
              <Typography gutterBottom>
                You can create a <strong>CNAME</strong> record that points to <strong>nocode.works</strong>
              </Typography>
              <Typography gutterBottom>
                Or you can create an <strong>A</strong> record that points to <strong>{ ip }</strong>
              </Typography>
            </div>
            
          </FormDialog>
        )
      }
      {
        deleteDialogUrl && (
          <DeleteConfirm
            title="Remove Domain?"
            onConfirm={ onRemoveUrl }
            onCancel={ () => setDeleteDialogUrl(null) }
          >
            <Typography>
              Are you <strong>absolutely sure</strong> you want to delete the { deleteDialogUrl } domain?
            </Typography>
          </DeleteConfirm>
        )
      }
    </>
  )
}

export default SettingsDomains
