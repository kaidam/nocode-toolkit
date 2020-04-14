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
    marginBottom: theme.spacing(2),
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
      size="lg"
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
          <Grid item xs={ 12 } sm={ 6 }>
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

            <div className={ classes.buttons }>
              <Button
                type="button"
                size="small"
                variant="contained"
                onClick={ () => window.open(url) }
                className={ classes.rightButton }
              >
                <LookIcon />&nbsp;&nbsp;View Website
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
            
          </Grid>
          <Grid item xs={ 12 } sm={ 6 }>
            <div className={ classes.content }>
              
              <div className={ classes.header }>
                <LookIcon
                  className={`${classes.headerIcon}`}
                />
                <Typography
                  variant="h6"
                >
                  { isJobLive ? 'Website' : 'Preview' } URL
                </Typography>
              </div>

              <div className={ classes.urlBlock }>
                <Typography className={ classes.link }><a target="_blank" href={ url }>{ url }</a></Typography>
              </div>

              <div className={ classes.buttons }>
                <Button
                  type="button"
                  size="small"
                  variant="contained"
                  onClick={ () => window.open(url) }
                  className={ classes.rightButton }
                >
                  <LookIcon />&nbsp;&nbsp;View Website
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
                        Your website is now live at the address shown above.  You can give this address
                        to your users so they can see your wonderful creation!
                      </Typography>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Typography>
                        This is your preview URL - you can use it to check everything is OK before publishing, 
                        perhaps send the link to colleagues to check.
                      </Typography>
                    </React.Fragment>
                  )
                }
              </div>

              

              <div className={ classes.textBlock }>
                {
                  isJobLive ? (
                    <React.Fragment>
                      <Typography>
                        If you have made a mistake - you can publish a previous build by clicking the <strong>"History"</strong>
                        button below.
                      </Typography>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Typography>
                        When you are happy that everything is correct, click the <strong>"Publish"</strong> button below and
                        your website will be live.  If you want to publish this build later, you can use the <strong>"History"</strong> button to publish any of your builds.
                      </Typography>
                    </React.Fragment>
                  )
                }
              </div>

            </div>  
          </Grid>
        </Grid>
        
      </div>
    </Window>
  )
}

export default SummaryDialog
