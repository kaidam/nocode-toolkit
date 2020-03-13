import React from 'react'
import { useSelector } from 'react-redux'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Loading from './Loading'

const useStyles = makeStyles(theme => createStyles({
  container: ({transparent}) => ({
    position: 'absolute',
    left: '0px',
    top: '0px',
    zIndex: 10000,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: transparent ?
      'rgba(255, 255, 255, 0.7)' :
      'rgba(255, 255, 255, 1)'
  }),
  loadingContainer: {
    width: '300px',
    height: '200px',
    backgroundColor: '#ffffff',
    //border: '1px solid #e5e5e5',
    boxShadow: 'none',
    borderRadius: 5,
  }
}))

const GlobalLoading = ({
  loading,
}) => {
  const loadingValues = typeof(loading) === 'object' ?
    loading :
    {}
  const {
    transparent = false,
    message = 'loading',
  } = loadingValues
  const classes = useStyles({transparent})
  if(!loading) return null
  return (
    <div className={ classes.container }>
      <div className={ classes.loadingContainer }>
        <Loading
          message={ message }
        />
      </div>
    </div>
  )
}

export default GlobalLoading