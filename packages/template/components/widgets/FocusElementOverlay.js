import React from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'

import library from '../../library'

const useStyles = makeStyles(theme => {
  return {
    root: {
      
    },
    panel: {
      backgroundColor: 'rgba(255,255,255, 0.4)',
      backdropFilter: 'blur(10px)',
      position: 'absolute',
      zIndex: 1300,
    },
    top: ({coords}) => ({
      width: '100%',
      height: coords.y,
      left: '0px',
      top: '0px',
    }),
    right: ({coords}) => ({
      width: window.innerWidth - coords.x - coords.width,
      height: coords.height,
      left: coords.x + coords.width,
      top: coords.y,
    }),
    bottom: ({coords}) => ({
      width: '100%',
      height: window.innerHeight - coords.y - coords.height,
      left: '0px',
      top: coords.y + coords.height,
    }),
    left: ({coords}) => ({
      width: coords.x,
      height: coords.height,
      left: '0px',
      top: coords.y,
    }),
  }
})

const FocusElementOverlay = ({
  contentRef,
}) => {
  const el = contentRef.current
  const coords = el.getBoundingClientRect()
  if(coords.y < library.topbarHeight) {
    coords.y = library.topbarHeight
    coords.height -= (library.topbarHeight - coords.y)
  }
  const classes = useStyles({coords})
  return (
    <div className={ classes.root }>
      <div className={ classnames(classes.panel, classes.top) }></div>
      <div className={ classnames(classes.panel, classes.right) }></div>
      <div className={ classnames(classes.panel, classes.bottom) }></div>
      <div className={ classnames(classes.panel, classes.left) }></div>
    </div>
  )
}

export default FocusElementOverlay