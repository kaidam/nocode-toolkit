import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

import useTabbedForm from '../hooks/useTabbedForm'
import websiteSelectors from '../../store/selectors/website'
import websiteActions from '../../store/modules/website'

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  tabs: {
    flexGrow: 0,
    backgroundColor: '#fff',
    borderBottom: 'solid 1px #ccc',
  },
  form: {
    flexGrow: 1,
    overflow: 'auto',
    padding: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(4),
  },
  buttons: {
    borderTop: 'solid 1px #ccc',
    backgroundColor: '#fff',
    flexGrow: 0,
  },
}))

const WebsiteForm = ({
  cancelTitle,
  buttonAlign,
  onCancel,
}) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const websiteId = useSelector(websiteSelectors.websiteId)
  const settingsSchema = useSelector(websiteSelectors.settingsSchema)
  const website = useSelector(websiteSelectors.websiteData)
  const settings = useSelector(websiteSelectors.settings)

  const onSubmit = useCallback(async (payload) => {
    const result = await dispatch(websiteActions.save(websiteId, payload))
    if(result) onCancel()
  }, [
    website,
    websiteId,
  ])

  if(!website) return null

  const renderForm = useTabbedForm({
    form: settingsSchema,
    values: settings,
    buttonAlign,
    cancelTitle,
    onSubmit,
    onCancel,
  })

  return renderForm(({
    getTabs,
    getForm,
    getButtons,
    hasTabs,
  }) => {
    return (
      <div className={ classes.root }>
        {
          hasTabs && (
            <div className={ classes.tabs }>
              { getTabs() }
            </div>
          )
        }
        <div className={ classes.form }>
          <Paper className={ classes.paper }>
            { getForm() }
          </Paper>
        </div>
        <div className={ classes.buttons }>
          { getButtons() }
        </div>
      </div>
    )
  })
}

export default WebsiteForm