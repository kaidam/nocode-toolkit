import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import icons from '../../icons'

const OpenIcon = icons.open

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: 'Roboto',
    padding: theme.spacing(1),
  },
  title: {
    margin: '0px',
  },
  tinyRoot: {
    width: '24px',
    height: '24px',
    minHeight: '24px',
    '& svg': {
      fontSize: '1rem',
    }
  },
}))

const DefaultBody = ({
  onClick,
}) => {
  const classes = useStyles()

  return (
    <div className={ classes.root }>
      <h3 className={ classes.title }>Your Google document is ready!</h3>
      <p>Any content you add to this document will appear on this page.</p>
      <div>
        <Button
          color="secondary"
          variant="contained"
          size="small"
          onClick={ (e) => {
            e.preventDefault()
            e.stopPropagation()
            onClick()
          }}
        >
          <OpenIcon />&nbsp;&nbsp;Edit Google Document
        </Button>
      </div>
    </div>
  )
}

export default DefaultBody
