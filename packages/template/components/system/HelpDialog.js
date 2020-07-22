import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'

import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import Actions from '../../utils/actions'
import uiActions from '../../store/modules/ui'
import dialogActions from '../../store/modules/dialog'
import dialogSelectors from '../../store/selectors/dialog'
import Window from '../dialog/Window'

import icons from '../../icons'
import globals from '../../utils/globals'

const HelpIcon = icons.help

const useStyles = makeStyles(theme => createStyles({
  
}))

const HelpDialog = ({

}) => {
  const classes = useStyles()
  const dialogParams = useSelector(dialogSelectors.dialogParams)

  const isOpen = dialogParams && dialogParams.name == 'help' ? true : false

  const actions = Actions(useDispatch(), {
    onOpenLiveChat: uiActions.openLiveChat,
    onClose: dialogActions.closeAll,
  })

  const chatlio = globals.getTracker('chatlio')

  return (
    <Window
      open={ isOpen }
      title="Help"
      size="sm"
      cancelTitle="Close"
      withCancel
      onCancel={ actions.onClose }
    >
      <Typography gutterBottom>You can email us at <b>support@kaidam.ltd</b></Typography>
      <Typography gutterBottom>Make sure you check out our <a target="_blank" href="https://guide.nocode.works"><b>guide</b></a> which has lots of tips for using nocode.</Typography>
      {
        chatlio && (
          <React.Fragment>
             <Typography gutterBottom>Or you can open our live chat widget:</Typography>
             <p>
              <Button
                variant="contained"
                color="secondary"
                onClick={ () => actions.onOpenLiveChat() }
              >
                Open live chat&nbsp;&nbsp;&nbsp;<HelpIcon />
              </Button>
            </p>
          </React.Fragment>
        )
      }
    </Window>
  )
}

export default HelpDialog