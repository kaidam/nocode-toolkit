import React from 'react'
import { useSelector } from 'react-redux'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'

import Error from './Error'
import CircularLoading from './CircularLoading'
import ParrotLoading from './ParrotLoading'

import uiSelectors from '../../store/selectors/ui'

const useStyles = makeStyles(theme => createStyles({
  root: {
    position: 'absolute',
    left: '0px',
    top: '0px',
    zIndex: 10000,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  container: {
    width: '600px',
    height: '300px',
    backgroundColor: '#ffffff',
    boxShadow: 'none',
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    textAlign: 'center',
  },
  logs: {
    color: '#999'
  },
}))

const Loading = ({
  
}) => {
  const classes = useStyles()
  const loading = useSelector(uiSelectors.loading)
  if(!loading) return null
  const loadingValues = typeof(loading) === 'object' ? loading : {}
  
  const {
    type = 'normal',
    message = 'loading...',
    error,
    logs = [],
  } = loadingValues

  return (
    <div className={ classes.root }>
      <div className={ classes.container }>
        {
          error ? (
            <Error
              message={ error }
            />
          ) : (
            <div className={ classes.content }>
              {
                type == 'parrot' ? (
                  <ParrotLoading />
                ) : (
                  <CircularLoading />
                )
              }
              {
                message && (
                  <Typography
                    variant='subtitle1'
                    color="secondary"
                  >
                    { message }
                  </Typography>
                )
              }
              {
                logs.map((log, i) => {
                  return (
                    <Typography
                      variant="body2"
                      key={ i }
                      className={ classes.logs }
                    >
                      { log }
                    </Typography>
                  )
                })
              }
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Loading