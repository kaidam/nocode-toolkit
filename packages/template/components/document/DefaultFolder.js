import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import icons from '../../icons'

const AddIcon = icons.add

const useStyles = makeStyles(theme => ({
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

const DefaultFolder = ({
  onClick,
}) => {
  const classes = useStyles()

  return (
    <div
      style={{
        fontFamily: 'Roboto'
      }}
    >
      <h3 className={ classes.title }>Your Google folder is ready!</h3>
      <p>Any folders or documents you add to this folder will appear on this page.</p>
      <div>
        <Button
          color="secondary"
          variant="contained"
          size="small"
          onClick={ (e) => {
            e.preventDefault()
            e.stopPropagation()
            onClick(e)
          }}
        >
          <AddIcon />&nbsp;&nbsp;Add Content
        </Button>
      </div>
    </div>
  )
}

export default DefaultFolder