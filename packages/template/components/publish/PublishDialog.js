import React, { useEffect, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'

import Button from '@material-ui/core/Button'
import Actions from '../../utils/actions'

import jobActions from '../../store/modules/job'
import dialogActions from '../../store/modules/dialog'
import jobSelectors from '../../store/selectors/job'
import dialogSelectors from '../../store/selectors/dialog'

import Window from '../dialog/Window'
import Logs from './Logs'
import PublishProgress from './Progress'

import icons from '../../icons'

const HistoryIcon = icons.history

const useStyles = makeStyles(theme => ({
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  },
  contentProgress: {
    width: '50%',
    height: '100%',
    overflowY: 'auto',
    marginRight: theme.spacing(2),
  },
  contentLogs: {
    width: '50%',
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
    onClose: dialogActions.closeAll,
    onLoad: jobActions.loadJob,
    onOpenHistory: jobActions.openHistory,
  })

  const dialogParams = useSelector(dialogSelectors.dialogParams)
  const data = useSelector(jobSelectors.data)
  const status = useSelector(jobSelectors.status)
  const error = useSelector(jobSelectors.error)
  const logs = useSelector(jobSelectors.logs)
  const canCloseWindow = useSelector(jobSelectors.canCloseWindow)

  const isOpen = dialogParams && dialogParams.name == 'publish' ? true : false

  // if we have an id param - it means we are viewing
  // this page from the publish history page
  const id = dialogParams ? dialogParams.id : null

  useEffect(() => {
    if(!id) return
    actions.onLoad(id)
  }, [
    id,
  ])

  return (
    <Window
      open={ isOpen }
      fullHeight
      size="lg"
      noScroll
      cancelTitle="Close"
      withCancel={ canCloseWindow }
      onCancel={ actions.onClose }
      leftButtons={
        canCloseWindow ? (
          <Button
            type="button"
            variant="contained"
            onClick={ actions.onOpenHistory }
          >
            <HistoryIcon />&nbsp;&nbsp;History
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