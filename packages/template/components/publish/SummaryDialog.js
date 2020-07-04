import React, { useEffect, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import {CopyToClipboard} from 'react-copy-to-clipboard'

import Actions from '../../utils/actions'
import green from '@material-ui/core/colors/green'
import blue from '@material-ui/core/colors/blue'

import jobActions from '../../store/modules/job'
import dialogActions from '../../store/modules/dialog'
import snackbarActions from '../../store/modules/snackbar'
import dialogSelectors from '../../store/selectors/dialog'
import systemSelectors from '../../store/selectors/system'
import jobSelectors from '../../store/selectors/job'

import Window from '../dialog/Window'

import icons from '../../icons'
import jobUtils from '../../utils/job'

const SuccessIcon = icons.success
const PublishIcon = icons.publish
const HistoryIcon = icons.history
const LookIcon = icons.look
const ClipboardIcon = icons.clipboard

const useStyles = makeStyles(theme => ({
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
    width: '300px',
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
  info: {
    color: blue[600],
  },
  rightButton: {
    marginLeft: theme.spacing(1),
  },
  textBlock: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    color: '#666',
  },
  urlBlock: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    color: '#666',
  },
  link: {
    fontSize: '0.9em'
  }
}))

const SummaryDialog = ({

}) => {
  const classes = useStyles()

  const dialogParams = useSelector(dialogSelectors.dialogParams)
  const config = useSelector(systemSelectors.config)
  const publishStatus = useSelector(jobSelectors.publishStatus)
  const job = useSelector(jobSelectors.data)

  const isJobLive = (
    job &&
    publishStatus &&
    publishStatus.job == job.jobid
  )

  const {
    id,
  } = (dialogParams.publishSummary || {})

  const actions = Actions(useDispatch(), {
    onClose: dialogActions.closeAll,
    onViewLogs: jobActions.viewLogs,
    onDeploy: jobActions.deploy,
    onOpenHistory: jobActions.openHistory,
    onLoadPublished: jobActions.loadPublished,
    onSetSuccess: snackbarActions.setSuccess,
  })

  useEffect(() => {
    if(!id) return
    actions.onLoadPublished(id)
  }, [
    id,
  ])

  if(!job || !job.result) return null

  let url = ''

  if(
    isJobLive &&
    publishStatus &&
    publishStatus.meta &&
    publishStatus.meta.urls &&
    publishStatus.meta.urls.length > 0
  ) {
    url = publishStatus.meta.urls[0]
  }

  if(!url) {
    url = jobUtils.getJobUrl(config, job)
  }

  const colorClassname = isJobLive ? classes.success : classes.info

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
            onClick={ actions.onOpenHistory }
            className={ classes.rightButton }
          >
            <HistoryIcon />&nbsp;&nbsp;History
          </Button>
          {
            !isJobLive && (
              <Button
                type="button"
                variant="contained"
                color="secondary"
                onClick={ () => actions.onDeploy({job}) }
                className={ classes.rightButton }
              >
                <PublishIcon />&nbsp;&nbsp;Publish
              </Button>
            )
          }
        </React.Fragment>
      )}
    >
      <div className={ classes.container }>
        <Grid container>
          <Grid item xs={ 12 }>
            <div className={ classes.header }>
              <SuccessIcon
                className={`${classes.headerIcon} ${colorClassname}`}
              />
              <Typography
                variant="h6"
                className={colorClassname}
              >
                {
                  isJobLive ? 
                    "Your Website is Now Published" : 
                    "Your Website Preview is Ready"
                }
              </Typography>
            </div>
            
            <a target="_blank" href={ url }>
              <img 
                className={ classes.screenshot }
                src={ job.result.screenshotUrl } 
              />
            </a>

            <div className={ classes.buttons }>
              <Button
                type="button"
                size="small"
                variant="contained"
                onClick={ () => window.open(url) }
                className={ classes.rightButton }
              >
                <LookIcon />
                  {
                isJobLive ? (
                  " : View Live Website"
                ) : (
                  " : View Website Preview"
                )
              }
              </Button>
              <CopyToClipboard
                text={ url }
                onCopy={ () => actions.onSetSuccess(`url copied to clipboard`) }
              >
                <Button
                  type="button"
                  size="small"
                  variant="contained"
                  className={ classes.rightButton }
                >
                  <ClipboardIcon />&nbsp;&nbsp;Copy URL to clipboard
                </Button>
              </CopyToClipboard>    
            </div>

            <div className={ classes.textBlock }>
              {
                isJobLive ? (
                  <React.Fragment>
                    <Typography>
                      Your website is now live!
                    </Typography>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Typography>
                    Click the "Publish" button below and your site will go live. If you want to publish this later or switch to a previous version click "History" in the main menu.
                    </Typography>
                  </React.Fragment>
                )
              }
            </div>

          </Grid>
        </Grid>
        
      </div>
    </Window>
  )
}

export default SummaryDialog
