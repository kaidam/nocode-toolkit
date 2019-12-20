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

const ErrorIcon = icons.error
const SuccessIcon = icons.success
const WaitingIcon = icons.waiting
const OpenIcon = icons.open
const LogsIcon = icons.logs
const UndoIcon = icons.undo
const PublishIcon = icons.publish
const RebuildIcon = icons.refresh
const LookIcon = icons.look

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
  success: {
    color: green[600],
  },
  waiting: {
    color: blue[600],
  },
  publishButton: {
    marginLeft: theme.spacing(1),
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
  title: 'Deployed To',
  name: 'deployed',
}, {
  title: 'Actions',
  name: 'deployActions',
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

  const getJobUrl = (job) => {
    const port = config.main_port == 80 || config.main_port == 443 ? '' : `:${config.main_port}`
    return `${config.main_protocol}://job-${job.website}-${job.jobid}.${config.main_domain}${port}`
  }

  const renderPublishUrl = (url, children) => {
    return (
      <a href={ url } target="_blank">
        { children || url }
      </a>
    )
  }

  const getJobStatus = (job) => {
    let Icon = null
    let className = null
    if(job.status == "complete") {
      Icon = SuccessIcon
      className = classes.success
    }
    else if(job.status == "error") {
      Icon = ErrorIcon
      className = classes.error
    }
    else {
      Icon = WaitingIcon
      className = classes.waiting
    }

    return (
      <div className={ classes.statusContainer }>
        <Icon className={ `${className} ${classes.icon}` } />
        <span className={ className }>{ job.status }</span>
      </div>
    )
  }


  const getJobDeployed = (deployed) => {
    if(!deployed) return null
    let Icon = null
    let className = null
    if(deployed == "live") {
      Icon = SuccessIcon
      className = classes.success
    }
    else if(deployed == "preview") {
      Icon = LookIcon
      className = classes.waiting
    }
    else {
      return null
    }

    return (
      <div className={ classes.statusContainer }>
        <Icon className={ `${className} ${classes.icon}` } />
        <span className={ className }>{ deployed }</span>
      </div>
    )
  }

  const tableData = data.map((job, index) => {
    let deployed = ''
    let screenshot = ''
    let publishAction = null
    let urls = [getJobUrl(job)]

    if(publishStatus && publishStatus.production && publishStatus.production.job == job.jobid) {
      deployed = 'live'
      urls = publishStatus.production.urls
    }
    else if(publishStatus && publishStatus.preview && publishStatus.preview.job == job.jobid) {
      deployed = 'preview'
      urls = publishStatus.preview.urls
      publishAction = (
        <Button 
          size="small"
          onClick={ () => actions.onDeploy({job: job.jobid, type: 'production'}) }
        >
          <PublishIcon /> Deploy live
        </Button>
      )
    }
    else {
      publishAction = (
        <Button 
          size="small"
          onClick={ () => actions.onDeploy({job:job.jobid, type: 'preview'}) }
        >
          <UndoIcon /> Rollback
        </Button>
      )
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
      status: getJobStatus(job),
      deployed: getJobDeployed(deployed),
      screenshot,
      deployActions: publishAction,
      actions: (
        <div>
          <Button 
            size="small"
            onClick={ () => window.open(urls[0]) }
          >
            <OpenIcon /> Visit
          </Button>
          <Button 
            size="small"
            onClick={ () => actions.onViewLogs({id: job.id, type: 'publish'}) }
          >
            <LogsIcon /> Logs
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