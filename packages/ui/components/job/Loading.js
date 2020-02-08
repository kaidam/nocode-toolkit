import React from 'react'
import { useSelector } from 'react-redux'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Loading from '../system/Loading'
import selectors from '../../store/selectors'

const useStyles = makeStyles(theme => createStyles({
  container: {
    position: 'absolute',
    left: '0px',
    top: '0px',
    zIndex: 10000,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  loadingContainer: {
    width: '300px',
    height: '200px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e5e5',
    boxShadow: '10px 10px 5px 0px rgba(0,0,0,0.2)',
  }
}))

const JobLoading = ({
  
}) => {
  const classes = useStyles()
  const loading = useSelector(selectors.job.loading)
  if(!loading) return null
  return (
    <div className={ classes.container }>
      <div className={ classes.loadingContainer }>
        <Loading />
      </div>
    </div>
  )
}

export default JobLoading