import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'

import Button from '@material-ui/core/Button'

import green from '@material-ui/core/colors/green'
import blue from '@material-ui/core/colors/blue'

import Actions from '../../utils/actions'

import jobActions from '../../store/modules/job'
import dialogActions from '../../store/modules/dialog'
import systemSelectors from '../../store/selectors/system'
import jobSelectors from '../../store/selectors/job'

import Window from '../dialog/Window'
import Loading from '../system/Loading'
import SimpleTable from '../table/SimpleTable'

import icons from '../../icons'
import jobUtils from '../../utils/job'

const ErrorIcon = icons.error
const SuccessIcon = icons.success
const WaitingIcon = icons.waiting
const LogsIcon = icons.logs
const PublishIcon = icons.publish
const BuildIcon = icons.build
const LookIcon = icons.look

const useStyles = makeStyles(theme => ({
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
  },
  link: {
    fontSize: '0.8em',
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
  title: 'URL',
  name: 'link',
}, {
  title: '',
  name: 'actions',
  numeric: true,
}]

const HistoryDialog = ({

}) => {
  const classes = useStyles()
  const config = useSelector(systemSelectors.config)
  const publishStatus = useSelector(jobSelectors.publishStatus)
  const data = useSelector(jobSelectors.list)
  const loading = useSelector(jobSelectors.loading.loadHistory)

  const actions = Actions(useDispatch(), {
    onClose: dialogActions.closeAll,
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
      screenshot = renderPublishUrl(urls[urls.length-1], (
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
      link: (
        <div className={ classes.link }>
          {
            deployed == 'live' && (
              <a href={ urls[urls.length-1] } target="_blank">
                { urls[urls.length-1] }
              </a>
            )
          }
        </div>
      ),
      actions: (
        <div>
          {
            deployed != 'live' && job.status == 'complete' && (
              <Button 
                size="small"
                className={ classes.rowButton }
                onClick={ () => actions.onDeploy({job}) }
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
                onClick={ () => window.open(urls[urls.length-1]) }
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

export default HistoryDialog
