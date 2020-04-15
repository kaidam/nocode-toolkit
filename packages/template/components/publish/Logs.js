import React, { useRef, useEffect, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import DialogContentText from '@material-ui/core/DialogContentText'

const useStyles = makeStyles(theme => ({
  paper: {
    height: '100%',
    backgroundColor: '#fff',
    fontSize: '0.8em',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #ccc',
  },
  errorContainer: {
    flexGrow: 0,
  },
  scrollerContainer: {
    flexGrow: 1,
    height: '100%',
    overflow: 'auto',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
  logContainer: {
    color: '#666',
    fontFamily: 'Courier',
  },
  scrollMarker: {
    float: 'left',
    clear: 'both',
  },
  errorText: {
    fontFamily: 'Courier',
    color: theme.palette.error.main,
    backgroundColor: '#fff',
    padding: theme.spacing(1),
  },
}))

const JobLogs = ({
  status,
  error,
  logText,
}) => {
  const classes = useStyles()
  const scrollerContainerRef = useRef()
  const scrollerBottomRef = useRef()

  const scrollToBottom = useCallback(() => {
    if(scrollerContainerRef.current && scrollerBottomRef.current) {
      scrollerBottomRef.current.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }, [scrollerContainerRef.current, scrollerBottomRef.current])

  useEffect(() => {
    scrollToBottom()
  }, [logText])

  return (
    <div className={ classes.paper }>
      <div 
        className={ classes.scrollerContainer }
        ref={ scrollerContainerRef }
      >
        <div className={ classes.logContainer }>
          <pre>
            <code>{ logText }</code>                 
          </pre>
        </div>
        <div
          ref={ scrollerBottomRef }
        >
        </div>
      </div>
      {
        status == 'error' && (
          <div className={ classes.errorContainer }>
            <DialogContentText className={ classes.errorText }>
              { error }
            </DialogContentText>
          </div>
        )
      }
    </div>
  )
}

export default JobLogs