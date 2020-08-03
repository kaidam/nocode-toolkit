import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Tooltip from '@material-ui/core/Tooltip'

import colorUtils from '@nocode-works/template/utils/color'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    height: '100%',
    '& .content': {
      height: '100%',
    },
  },
  clicker: ({open}) => ({
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    backgroundColor: open ? colorUtils.getAlpha(theme.palette.primary.main, 0.2) : null,
    '&:hover': {
      backgroundColor: colorUtils.getAlpha(theme.palette.primary.main, 0.2),
    }
  }),
  tooltipContent: {
    width: '100%',
    height: '100%',
  },
}))

const EditableElement = ({
  children,
  onClick,
} = {}) => {

  const classes = useStyles({
    open: false,
  })

  return (
    <>
      <div
        className={ classes.root }
      >
        <div>
          { children }
        </div>
        <div
          className={ classes.clicker }
          onClick={ onClick }
        >
          <Tooltip title="Click to edit" placement="top" arrow>
            <div className={ classes.tooltipContent }></div>
          </Tooltip>
        </div>
      </div>
    </>
  )
}

export default EditableElement
