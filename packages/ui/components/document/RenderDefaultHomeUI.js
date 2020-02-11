import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import Button from '@material-ui/core/Button'

import icons from '../../icons'

import ItemOptions from '../buttons/ItemOptions'

const AddIcon = icons.add
const EditIcon = icons.moreVert
const SettingsIcon = icons.settings

const useStyles = makeStyles(theme => createStyles({
  tinyRoot: {
    width: '24px',
    height: '24px',
    minHeight: '24px',
    '& svg': {
      fontSize: '1rem',
    }
  },
  tinyLogo: {
    height: '24px',
    verticalAlign: 'middle',
  },
}))

const RenderDefaultHomeUI = ({

}) => {
  const classes = useStyles()

  return (
    <div>
      <p>You can add content by clicking the <b>add</b> (&nbsp;<Fab
          size="small"
          color="secondary"
          className={ classes.tinyRoot }
          onClick={ () => {} }
        >
          <AddIcon />
        </Fab>&nbsp;) button on any section.</p>
      <p>You can edit content by clicking the <b>edit</b> (&nbsp;<Fab
          size="small"
          className={ classes.tinyRoot }
          onClick={ () => {} }
        >
          <EditIcon />
        </Fab>&nbsp;) button next to items.</p>
      <p>You can publish your website by clicking the <b>nocode settings</b> (&nbsp;<img src="images/favicon.png" className={ classes.tinyLogo } />&nbsp;) button top right.</p>
      <div>
        <ItemOptions
          item={{
            id: 'home'
          }}
          groupFilter="driveGroup"
          iconClassName="navbar-ui-icon"
          getButton={onClick => (
            <Button
              color="secondary"
              variant="contained"
              size="small"
              onClick={ onClick }
            >
              <AddIcon />&nbsp;&nbsp;Add Homepage
            </Button>
          )}
        />
      </div>
    </div>
  )
}

export default RenderDefaultHomeUI
