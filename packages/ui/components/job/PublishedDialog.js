import React, { useEffect, useMemo } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button'

import Actions from '../../utils/actions'
import green from '@material-ui/core/colors/green'

import selectors from '../../store/selectors'
import jobActions from '../../store/modules/job'

import Window from '../system/Window'

import icons from '../../icons'
import { Typography } from '@material-ui/core'

const SuccessIcon = icons.success
const LogsIcon = icons.logs
const OpenIcon = icons.open
const PublishIcon = icons.publish
const HistoryIcon = icons.history

const DIALOG = 'jobPublished'

const useStyles = makeStyles(theme => createStyles({
  container: {
    textAlign: 'center',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(3),
  },
  headerIcon: {
    marginRight: theme.spacing(3),
  },
  screenshot: {
    border: '1px solid #000',
    width: '200px',
    minHeight: '150px',
    boxShadow: '5px 5px 10px 0px rgba(153,153,153,1)',
  },
  content: {
    margin: theme.spacing(3),
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(3),
  },
  success: {
    color: green[600],
  },
  rightButton: {
    marginLeft: theme.spacing(1),
  }
}))

const JobPublishedDialog = ({

}) => {
  const classes = useStyles()
  const queryParams = useSelector(selectors.router.queryParams)
  const config = useSelector(state => state.ui.config)
  const publishStatus = useSelector(selectors.job.publishStatus)
  const job = useSelector(selectors.job.data)

  const {
    id,
    type = 'preview',
  } = queryParams

  const actions = Actions(useDispatch(), {
    onClose: jobActions.closeWindow,
    onViewLogs: jobActions.viewLogs,
    onPublish: jobActions.publish,
    onDeploy: jobActions.deployFromPublished,
    onOpenHistory: jobActions.openHistory,
    onViewLogs: jobActions.viewLogs,
    onLoadPublished: jobActions.loadPublished,
  })

  useEffect(() => {
    actions.onLoadPublished(id)
  }, [])

  const content = useMemo(() => {
    if(!job) return null

    let url = ''

    if(publishStatus) {
      const publishData = type == 'live' ? publishStatus.production : publishStatus.preview
      if(publishData && publishData.urls) url = publishData.urls[0]
    }

    return (
      <div className={ classes.container }>
        <div className={ classes.header }>
          <SuccessIcon
            className={`${classes.headerIcon} ${classes.success}`}
          />
          <Typography
            variant="h6"
            className={classes.success}
          >
            {
              type == 'live' ? 
                "Your website is now live" : 
                "Your website has been built"
            }
          </Typography>
        </div>
        
        <a target="_blank" href={ url }>
          <img 
            className={ classes.screenshot }
            src={ job.result.screenshotUrl } 
          />
        </a>

        <div className={ classes.content }>
          {
            type == 'live' ? (
              <Typography>Your website has made live!</Typography>
            ) : (
              <Typography>Your website has been built!</Typography>
            )
          }

          <Typography><a target="_blank" href={ url }>{ url }</a></Typography>

          <div className={ classes.buttons }>
            <Button
              type="button"
              variant="contained"
              onClick={ () => window.open(url) }
              className={ classes.rightButton }
            >
              <OpenIcon /> View Website
            </Button>
            {
              type == 'live' ? null : (
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  onClick={ () => actions.onDeploy({job: job.jobid, type: 'production'}) }
                  className={ classes.rightButton }
                >
                  <PublishIcon /> Make Live
                </Button>
              )
            }
          </div>
          
        </div>
      </div>
    )
  }, [
    job,
    type,
    publishStatus,
  ])

  return (
    <Window
      open
      size="sm"
      cancelTitle="Close"
      withCancel
      onCancel={ actions.onClose }
      rightButtons={(
        <React.Fragment>
          <Button
            type="button"
            variant="contained"
            onClick={ () => actions.onViewLogs({id: job.id, type: 'publish'}) }
            className={ classes.rightButton }
          >
            <LogsIcon /> Logs
          </Button>
          <Button
            type="button"
            variant="contained"
            onClick={ actions.onOpenHistory }
            className={ classes.rightButton }
          >
            <HistoryIcon /> Publish History
          </Button>
        </React.Fragment>
      )}
    >
      {
        content
      }
    </Window>
  )
}

export default JobPublishedDialog