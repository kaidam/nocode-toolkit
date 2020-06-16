import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'

import CircularLoading from './CircularLoading'

import library from '../../library'

const useStyles = makeStyles(theme => createStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  container: {
    maxWidth: '100%'
  },
  item: {
    textAlign: 'center',
    display: 'inline-block',
  },
}))

const Loading = ({
  color = 'primary',
  message = 'loading',
  children,
  useLibraryComponent = false,
}) => {
  const classes = useStyles()
  const LoadingComponent = useLibraryComponent ? (library.components.loading || CircularLoading) : CircularLoading
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.item}>
          <LoadingComponent />
          { 
            message && (
              <Typography
                variant='subtitle1'
                color={ color }
              >
                { message }
              </Typography>
            )
          }
          {
            children
          }
        </div>
        
      </div>
    </div>
  )
}

export default Loading