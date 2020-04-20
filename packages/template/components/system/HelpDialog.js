import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'

import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import Actions from '../../utils/actions'
import uiActions from '../../store/modules/ui'
import dialogActions from '../../store/modules/dialog'
import Window from '../dialog/Window'

import icons from '../../icons'
import globals from '../../utils/globals'

const HelpIcon = icons.help

const useStyles = makeStyles(theme => createStyles({
  
}))

const HelpDialog = ({

}) => {
  const classes = useStyles()

  const actions = Actions(useDispatch(), {
    onOpenLiveChat: uiActions.openLiveChat,
    onClose: dialogActions.closeAll,
  })

  const crisp = globals.getTracker('crisp')

  return (
    <Window
      open
      title="Help"
      size="lg"
      cancelTitle="Close"
      withCancel
      onCancel={ actions.onClose }
    >
      <Typography>You can email us at <b>support@kaidam.ltd</b></Typography>
      {
        crisp && (
          <React.Fragment>
             <Typography>OR open the live chat widget:</Typography>
             <p>
              <Button
                variant="contained"
                color="secondary"
                onClick={ () => actions.onOpenLiveChat() }
              >
                Open live chat <HelpIcon />
              </Button>
            </p>
          </React.Fragment>
        )
      }
    </Window>
  )
}

export default HelpDialog