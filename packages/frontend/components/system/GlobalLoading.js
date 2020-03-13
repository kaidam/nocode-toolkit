import React from 'react'
import { useSelector } from 'react-redux'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Loading from './Loading'
import uiSelectors from '../../store/selectors/ui'

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
    boxShadow: 'none',
    borderRadius: 5,
  }
}))

const GlobalLoading = ({
  
}) => {
  const classes = useStyles()
  const loading = useSelector(uiSelectors.loading)
  if(!loading) return null
  return (
    <div className={ classes.container }>
      <div className={ classes.loadingContainer }>
        <Loading />
      </div>
    </div>
  )
}

export default GlobalLoading