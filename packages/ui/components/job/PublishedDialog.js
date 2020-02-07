import React, { useEffect, useMemo } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import {CopyToClipboard} from 'react-copy-to-clipboard'

import Actions from '../../utils/actions'
import green from '@material-ui/core/colors/green'
import blue from '@material-ui/core/colors/blue'

import selectors from '../../store/selectors'
import jobActions from '../../store/modules/job'
import snackbarActions from '../../store/modules/snackbar'

import Window from '../system/Window'

import icons from '../../icons'
import { Typography } from '@material-ui/core'
import jobUtils from '../../utils/job'

const SuccessIcon = icons.success
const LogsIcon = icons.logs
const PublishIcon = icons.publish
const HistoryIcon = icons.history
const LookIcon = icons.look
const ClipboardIcon = icons.clipboard

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
  link: {
    fontSize: '0.9em'
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
    onSetSuccess: snackbarActions.setSuccess,
  })

  useEffect(() => {
    actions.onLoadPublished(id)
  }, [])

  const content = useMemo(() => {
    if(!job) return null

    let url = ''

    if(publishStatus) {
      const publishData = type == 'live' ? publishStatus.production : null
      if(publishData && publishData.urls) url = publishData.urls[0]
    }

    if(!url) {
      url = jobUtils.getJobUrl(config, job)
    }

    const colorClassname = type == 'live' ? classes.success : classes.info

    return (
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
                  { type == 'live' ? 'Website' : 'Preview' } URL
                </Typography>
              </div>

              <div className={ classes.textBlock }>
                {
                  type == 'live' ? (
                    <React.Fragment>
                      <Typography>
                        Your website is now live at the following address.  You can give this address
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
                <Typography className={ classes.link }><a target="_blank" href={ url }>{ url }</a></Typography>
              </div>

              <div className={ classes.buttons }>
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
                    <ClipboardIcon />&nbsp;&nbsp;Copy to clipboard
                  </Button>
                </CopyToClipboard>    
              </div>

              <div className={ classes.textBlock }>
                {
                  type == 'live' ? (
                    <React.Fragment>
                      <Typography>
                        If you have made a mistake - you can publish a previous build by clicking the "Build History"
                        button below.
                      </Typography>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Typography>
                        When you are happy that everything is correct, click the <strong>"Publish"</strong> button below and
                        your website will be live.<br /><br />
                      </Typography>
                      <Typography>
                        If you want to publish this build later, you can use the "Build History" button to publish any of your builds.
                      </Typography>
                    </React.Fragment>
                  )
                }
              </div>

            </div>  
          </Grid>
        </Grid>
        
      </div>
    )
  }, [
    job,
    config,
    type,
    publishStatus,
  ])

  return (
    <Window
      open
      size="md"
      cancelTitle="Close"
      withCancel
      onCancel={ actions.onClose }
      rightButtons={(
        <React.Fragment>
          {
            type != 'live' && (
              <Button
                type="button"
                variant="contained"
                color="secondary"
                onClick={ () => actions.onDeploy({viewid: job.id, jobid: job.jobid, type: 'production'}) }
                className={ classes.rightButton }
              >
                <PublishIcon />&nbsp;&nbsp;Publish
              </Button>
            )
          }
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


/*

  <Button
            type="button"
            variant="contained"
            onClick={ () => actions.onViewLogs({id: job.id, type: 'publish'}) }
            className={ classes.rightButton }
          >
            <LogsIcon />&nbsp;&nbsp;Logs
          </Button>
          <Button
            type="button"
            variant="contained"
            onClick={ actions.onOpenHistory }
            className={ classes.rightButton }
          >
            <HistoryIcon />&nbsp;&nbsp;Build History
          </Button>

*/