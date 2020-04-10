import React, { useEffect, useMemo } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'

import Actions from '../../utils/actions'
import Button from '@material-ui/core/Button'

import selectors from '../../store/selectors'
import jobActions from '../../store/modules/job'

import Window from '../system/Window'
import Logs from './Logs'
import PublishProgress from './PublishProgress'

const useStyles = makeStyles(theme => createStyles({
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  },
  contentProgress: {
    width: '40%',
    height: '100%',
    overflowY: 'auto',
    marginRight: theme.spacing(2),
  },
  contentLogs: {
    width: '60%',
    height: '100%',
  },
  allheight: {
    height: '100%',
  },
}))

const JobDialog = ({

}) => {
  const classes = useStyles()
  const actions = Actions(useDispatch(), {
    onClose: jobActions.closeWindow,
    onLoad: jobActions.loadJob,
  })

  const queryParams = useSelector(selectors.router.queryParams)
  const data = useSelector(selectors.job.data)
  const status = useSelector(selectors.job.status)
  const error = useSelector(selectors.job.error)
  const logs = useSelector(selectors.job.logs)
  const canCloseWindow = useSelector(selectors.job.canCloseWindow)

  const {
    id,
    load,
    type,
    back,
  } = queryParams

  useEffect(() => {
    if(load) actions.onLoad(id)
  }, [id, load])

  const content = useMemo(() => {
    const logScreen = (
      <Logs
        status={ status }
        error={ error }
        logText={ logs }
      />
    )

    return type == 'publish' ? (
      <div className={ classes.contentContainer }>
        <div className={ classes.contentProgress }>
          <PublishProgress
            jobData={ data }
          />
        </div>
        <div className={ classes.contentLogs }>
          { logScreen }
        </div>
      </div>
    ) : logScreen
  }, [
    status,
    error,
    logs,
    type,
    data,
  ])

  return (
    <Window
      open
      size="lg"
      cancelTitle="Close"
      withCancel={ canCloseWindow }
      onCancel={ actions.onClose }
      leftButtons={
        back ? (
          <Button
            type="button"
            variant="contained"
            onClick={ () => window.history.back() }
          >
            Back
          </Button>
        ) : null
      }
    >
      { content }
    </Window>
  )
}

export default JobDialog