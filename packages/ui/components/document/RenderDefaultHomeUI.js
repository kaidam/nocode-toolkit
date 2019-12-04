import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import Button from '@material-ui/core/Button'

import icons from '../../icons'

import ItemOptions from '../buttons/ItemOptions'

const AddIcon = icons.add
const EditIcon = icons.edit
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
  buttonEdit: {
    marginLeft: theme.spacing(1),
  }
}))

const RenderDefaultHomeUI = ({

}) => {
  const classes = useStyles()

  return (
    <div>
      <p>You can add content by clicking the <b>add</b> (<Fab
          size="small"
          color="secondary"
          className={ classes.tinyRoot }
          onClick={ () => {} }
        >
          <AddIcon />
        </Fab>) button on any section.</p>
      <p>You can edit content by clicking the <b>edit</b> (<Fab
          size="small"
          color="secondary"
          className={ classes.tinyRoot }
          onClick={ () => {} }
        >
          <EditIcon />
        </Fab>) button next to items.</p>
      <p>You can publish your website by clicking the <b>settings</b> (<Fab
          size="small"
          color="secondary"
          className={ classes.tinyRoot }
          onClick={ () => {} }
        >
          <SettingsIcon />
        </Fab>) button top right.</p>
      <div>
        <ItemOptions
          item={{
            id: 'home'
          }}
          iconClassName="navbar-ui-icon"
          getButton={onClick => (
            <Button
              color="secondary"
              variant="contained"
              onClick={ onClick }
            >
              Update Homepage <EditIcon className={ classes.buttonEdit }/> 
            </Button>
          )}
        />
      </div>
    </div>
  )
}

export default RenderDefaultHomeUI
