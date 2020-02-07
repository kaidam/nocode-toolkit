import React, { useEffect, useMemo, useCallback } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'

import Button from '@material-ui/core/Button'

import green from '@material-ui/core/colors/green'
import blue from '@material-ui/core/colors/blue'

import Actions from '../../utils/actions'
import selectors from '../../store/selectors'
import jobActions from '../../store/modules/job'

import Window from '../system/Window'
import Loading from '../system/Loading'
import SimpleTable from '../table/SimpleTable'

import icons from '../../icons'
import jobUtils from '../../utils/job'

const ErrorIcon = icons.error
const SuccessIcon = icons.success
const WaitingIcon = icons.waiting
const OpenIcon = icons.open
const LogsIcon = icons.logs
const UndoIcon = icons.undo
const PublishIcon = icons.publish
const BuildIcon = icons.build
const LookIcon = icons.look
const RebuildIcon = icons.refresh

const useStyles = makeStyles(theme => createStyles({
  screenshot: {
    border: '1px solid #000',
    height: '48px',
    boxShadow: '5px 5px 10px 0px rgba(153,153,153,1)',
  },
  date: {
    color: '#999'
  },
  statusContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  error: {
    color: theme.palette.error.dark,
  },
  built: {
    color: blue[600],
  },
  published: {
    color: green[600],
  },
  unknown: {
    color: '#666',
  },
  publishButton: {
    marginLeft: theme.spacing(1),
  },
  rowButton: {
    marginRight: theme.spacing(1),
  }
}))

const fields =[{
  title: 'Screenshot',
  name: 'screenshot',
}, {
  title: 'Created',
  name: 'created_at',
}, {
  title: 'Status',
  name: 'status',
}, {
  title: '',
  name: 'actions',
  numeric: true,
}]

const JobHistoryDialog = ({

}) => {
  const classes = useStyles()
  const config = useSelector(state => state.ui.config)
  const publishStatus = useSelector(selectors.job.publishStatus)
  const data = useSelector(selectors.job.list)
  const loading = useSelector(selectors.job.loading.loadHistory)

  const actions = Actions(useDispatch(), {
    onClose: jobActions.closeWindow,
    onViewLogs: jobActions.viewLogs,
    onPublish: jobActions.publish,
    onRebuild: jobActions.rebuild,
    onDeploy: jobActions.deploy,
    onLoadHistory: jobActions.loadHistory,
  })

  useEffect(() => {
    actions.onLoadHistory()
  }, [])

  const renderPublishUrl = (url, children) => {
    return (
      <a href={ url } target="_blank">
        { children || url }
      </a>
    )
  }

  const getJobStatus = (job, deployed) => {
    let Icon = null
    let className = null
    let statusText = ''

    if(job.status == "complete") {
      Icon = BuildIcon
      className = classes.built
      statusText = 'Built'
    }
    else if(job.status == "error") {
      Icon = ErrorIcon
      className = classes.error
      statusText = 'Error'
    }
    else {
      Icon = WaitingIcon
      className = classes.unknown
      statusText = 'Waiting'
    }

    if(deployed == "live") {
      Icon = SuccessIcon
      className = classes.published
      statusText = 'Published'
    }

    return (
      <div className={ classes.statusContainer }>
        <Icon className={ `${className} ${classes.icon}` } />
        <span className={ className }>{ statusText }</span>
      </div>
    )
  }

  const tableData = data.map((job, index) => {
    let deployed = ''
    let screenshot = ''
    let publishAction = null
    let urls = [jobUtils.getJobUrl(config, job)]

    if(publishStatus && publishStatus.production && publishStatus.production.job == job.jobid) {
      deployed = 'live'
      urls = publishStatus.production.urls
    }
  
    if(job.result && job.result.screenshotUrl) {
      screenshot = renderPublishUrl(urls[0], (
        <img 
          className={ classes.screenshot }
          src={ job.result.screenshotUrl } 
        />
      ))
    }

    return {
      id: job.id,
      created_at: (
        <span className={ classes.date }>
          { new Date(job.created_at).toLocaleString() }
        </span>
      ),
      status: getJobStatus(job, deployed),
      screenshot,
      actions: (
        <div>
          {
            deployed != 'live' && job.status == 'complete' && (
              <Button 
                size="small"
                className={ classes.rowButton }
                onClick={ () => actions.onDeploy({job: job.jobid, type: 'production'}) }
              >
                <PublishIcon />&nbsp;&nbsp;Publish
              </Button>
            )
          }
          {
            job.status == 'complete' && (
              <Button 
                size="small"
                className={ classes.rowButton }
                onClick={ () => window.open(urls[0]) }
              >
                <LookIcon />&nbsp;&nbsp;View
              </Button>
            )
          }
          <Button 
            size="small"
            className={ classes.rowButton }
            onClick={ () => actions.onViewLogs({id: job.id, type: 'publish'}) }
          >
            <LogsIcon />&nbsp;&nbsp;Logs
          </Button>
        </div>
      ),
    }
  })

  return (
    <Window
      open
      size="lg"
      fullHeight
      cancelTitle="Close"
      withCancel
      onCancel={ actions.onClose }
    >
      {
        loading ? (
          <Loading />
        ) : (
          <SimpleTable
            data={ tableData }
            fields={ fields }
          />
        )
      }
    </Window>
  )
}

export default JobHistoryDialog

// {
//   loading ? (
//     <Loading />
//   ) : (
//     <SimpleTable
//       data={ tableData }
//       fields={ fields }
//     />
//   )
// }

/*

  rightButtons={(
        <React.Fragment>
          <Button
            type="button"
            variant="contained"
            onClick={ actions.onRebuild }
            className={ classes.publishButton }
          >
            <RebuildIcon /> Rebuild Preview
          </Button>
          <Button
            type="button"
            variant="contained"
            color="secondary"
            onClick={ actions.onPublish }
            className={ classes.publishButton }
          >
            <PublishIcon /> Publish Now
          </Button>
        </React.Fragment>
        
      )}

*/