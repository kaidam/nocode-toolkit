import React, { useEffect, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'

import Button from '@material-ui/core/Button'
import Actions from '../../utils/actions'

import jobActions from '../../store/modules/job'
import jobSelectors from '../../store/selectors/job'
import routerSelectors from '../../store/selectors/router'

import Window from '../dialog/Window'
import Logs from './Logs'
import PublishProgress from './Progress'

const useStyles = makeStyles(theme => ({
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

  const queryParams = useSelector(routerSelectors.queryParams)
  const data = useSelector(jobSelectors.data)
  const status = useSelector(jobSelectors.status)
  const error = useSelector(jobSelectors.error)
  const logs = useSelector(jobSelectors.logs)
  const canCloseWindow = useSelector(jobSelectors.canCloseWindow)

  // if there is a jobid it means we are looking at an old job
  // not the currently publishing one
  const {
    jobid,
  } = queryParams

  return (
    <Window
      open
      fullHeight
      size="xl"
      noScroll
      cancelTitle="Close"
      withCancel={ canCloseWindow }
      onCancel={ actions.onClose }
      leftButtons={
        jobid ? (
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
      <div className={ classes.contentContainer }>
        <div className={ classes.contentProgress }>
          <PublishProgress
            jobData={ data }
          />
        </div>
        <div className={ classes.contentLogs }>
          <Logs
            status={ status }
            error={ error }
            logText={ logs }
          />
        </div>
      </div>
    </Window>
  )
}

export default JobDialog