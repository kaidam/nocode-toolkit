import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Form from '../form/Form'

import websiteSelectors from '../../store/selectors/website'
import websiteActions from '../../store/modules/website'
import routerActions from '../../store/modules/router'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(4),
  },
  buttons: {
    marginTop: theme.spacing(4),
  },
  footer: {
    marginTop: theme.spacing(4),
  },
  button: {
    marginRight: theme.spacing(2),
  }
}))

const SCHEMA = [{
  id: 'name',
  title: 'Name',
  helperText: 'Enter the name of the website',
  validate: {
    type: 'string',
    methods: [
      ['required', 'The name is required'],
    ]
  }
}]

const HANDLERS = {}

const WebsiteForm = ({
  onCancel,
}) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const websiteId = useSelector(websiteSelectors.websiteId)
  const website = useSelector(websiteSelectors.websiteData)
  const loading = useSelector(websiteSelectors.save.loading)
  const error = useSelector(websiteSelectors.save.error)
  
  const onSave = useCallback(async (payload) => {
    const result = await dispatch(websiteActions.save(websiteId, payload))
    if(result) dispatch(routerActions.navigateTo('website.list'))
  }, [
    website,
    websiteId,
  ])

  if(!website) return null

  return (
    <Form
      schema={ SCHEMA }
      handlers={ HANDLERS }
      error={ error }
      initialValues={ website }
      onSubmit={ onSave }
    >
      {
        ({
          isValid,
          onSubmit,
        }) => {
          return (
            <div className={ classes.buttons }>
              {
                onCancel && (
                  <Button
                    className={ classes.button }
                    variant="contained"
                    onClick={ onCancel }
                  >
                    Cancel
                  </Button>
                )
              }
              <Button
                className={ classes.button }
                variant="contained"
                color="primary"
                disabled={ loading || !isValid }
                onClick={ onSubmit }
              >
                Save
              </Button>
            </div>
          )
        }
      }
    </Form>
  )
}

export default WebsiteForm