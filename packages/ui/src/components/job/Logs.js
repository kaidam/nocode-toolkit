import React, { useRef, useEffect, useCallback } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import DialogContentText from '@material-ui/core/DialogContentText'

const useStyles = makeStyles(theme => createStyles({
  paper: {
    height: '100%',
    backgroundColor: '#000',
    fontSize: '0.8em',
    //boxShadow: '10px 10px 20px 0px rgba(0,0,0,0.4)',
  },
  scrollerContainer: {
    height: '100%',
    overflow: 'auto',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
  logContainer: {
    color: '#0f0',
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
    <Paper className={ classes.paper }>
      <div 
        className={ classes.scrollerContainer }
        ref={ scrollerContainerRef }
      >
        {
          status == 'error' && (
            <DialogContentText className={ classes.errorText }>
              { error }
            </DialogContentText>
          )
        }
        <div className={ classes.logContainer }>
          <pre>
            <code>{ logText }</code>                 
          </pre>
        </div>
        {
          status == 'error' && (
            <DialogContentText className={ classes.errorText }>
              { error }
            </DialogContentText>
          )
        }
        <div
          ref={ scrollerBottomRef }
        >
        </div>
      </div>
    </Paper>
  )
}

export default JobLogs