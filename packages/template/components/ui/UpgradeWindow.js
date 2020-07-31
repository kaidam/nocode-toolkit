import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import Typography from '@material-ui/core/Typography'

import Window from '../dialog/Window'

import websiteSelectors from '../../store/selectors/website'
import uiSelectors from '../../store/selectors/ui'
import uiActions from '../../store/modules/ui'

const useStyles = makeStyles(theme => ({
  para: {
    marginBottom: theme.spacing(2),
  }
}))

const UpgradeDialog = ({

}) => {

  const classes = useStyles()
  const dispatch = useDispatch()
  const websiteId = useSelector(websiteSelectors.websiteId)
  const upgradeWindow = useSelector(uiSelectors.upgradeWindow)

  const onOpenPlan = useCallback(() => {
    const loc = document.location
    document.location = `${loc.protocol}//${loc.hostname}/website/edit/${websiteId}?section=plan`
  }, [
    websiteId,
  ])

  const onCloseWindow = useCallback(() => {
    dispatch(uiActions.setUpgradeWindow(null))
  })

  return (
    <Window
      open={ upgradeWindow ? true : false }
      title={ upgradeWindow ? upgradeWindow.title : '' }
      size="sm"
      withCancel
      submitTitle="View Plans"
      onCancel={ onCloseWindow }
      onSubmit={ onOpenPlan }
    > 
      <Typography className={ classes.para }>
        In order to perform this action you will need to upgrade your plan.
      </Typography>
    </Window>
  )
}

export default UpgradeDialog