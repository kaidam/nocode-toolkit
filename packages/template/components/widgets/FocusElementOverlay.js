import React from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'

import library from '../../library'

const useStyles = makeStyles(theme => {
  const topbarHeight = theme.layout.topbarHeight
  const processCoords = (coords) => {
    if(coords.y < topbarHeight) {
      coords.y = topbarHeight
      coords.height -= (topbarHeight - coords.y)
    }
    return coords
  }

  return {
    root: {
      
    },
    panel: {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      position: 'absolute',
      zIndex: 1300,
    },
    top: ({coords}) => {
      const processedCoords = processCoords(coords)
      return {
        width: '100%',
        height: processedCoords.y,
        left: '0px',
        top: '0px',
      }
    },
    right: ({coords}) => {
      const processedCoords = processCoords(coords)
      return {
        width: window.innerWidth - processedCoords.x - processedCoords.width,
        height: processedCoords.height,
        left: processedCoords.x + processedCoords.width,
        top: processedCoords.y,
      }
    },
    bottom: ({coords}) => {
      const processedCoords = processCoords(coords)
      return {
        width: '100%',
        height: window.innerHeight - processedCoords.y - processedCoords.height,
        left: '0px',
        top: processedCoords.y + processedCoords.height,
      }
    },
    left: ({coords}) => {
      const processedCoords = processCoords(coords)
      return {
        width: processedCoords.x,
        height: processedCoords.height,
        left: '0px',
        top: processedCoords.y,
      }
    },
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