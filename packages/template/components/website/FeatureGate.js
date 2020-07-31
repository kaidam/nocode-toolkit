import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import websiteSelectors from '../../store/selectors/website'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    left: '0px',
    top: '0px',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningContent: {
    backgroundColor: '#ffffff',
    border: '1px solid #999',
    padding: theme.spacing(4),
  },
  para: {
    marginBottom: theme.spacing(2),
  }
}))

const FeatureGate = ({
  feature,
  children,
}) => {

  const classes = useStyles()
  const dispatch = useDispatch()

  const websiteId = useSelector(websiteSelectors.websiteId)
  const features = useSelector(websiteSelectors.websiteFeatures)

  const onOpenPlan = useCallback(() => {
    const loc = document.location
    document.location = `${loc.protocol}//${loc.hostname}/website/edit/${websiteId}?section=plan`
  }, [
    websiteId,
  ])

  if(!features[feature]) {
    return (
      <div className={ classes.root }>
        { children }
        <div className={ classes.overlay }>
          <div className={ classes.warningContent }>
            <Typography className={ classes.para }>
              In order to perform this action you will need to upgrade your plan.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={ onOpenPlan }
            >
              View Plans
            </Button>
          </div>
        </div>
      </div>
    )
  }
  else {
    return children
  }
}

export default FeatureGate
