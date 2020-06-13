import React, { useRef, useEffect, useState } from 'react'
import classnames from 'classnames'
import { makeStyles, useTheme } from '@material-ui/core/styles'

const processPadding = (obj) => {
  obj = obj || {}
  if(typeof(obj) === 'number') {
    obj = {
      top: obj,
      right: obj,
      bottom: obj,
      left: obj,
    }
  }
  return {
    top: obj.top || 0,
    right: obj.right || 0,
    bottom: obj.bottom || 0,
    left: obj.left || 0,
  }
}

const processOffset = (obj) => {
  obj = obj || {}
  if(typeof(obj) === 'number') {
    obj = {
      x: obj,
      y: obj,
    }
  }
  return {
    x: obj.x || 0,
    y: obj.y || 0,
  }
}

const calculateBoundingBox = ({
  coords,
  padding,
  offset,
}) => {
  return {
    width: coords.width + padding.left + padding.right,
    height: coords.height + padding.top + padding.bottom,
    top: coords.y - padding.top + offset.y,
    left: coords.x - padding.left + offset.x,
    bottom: coords.y + coords.height + padding.bottom + offset.y,
    right: coords.x + coords.width + padding.right + offset.x,
  }
}

const useStyles = makeStyles(theme => {
  return {
    root: {
     
    },
    clicker: {
      
    },
    panel: ({zIndex}) => ({
      backgroundColor: 'rgba(0, 0, 0, 0)',
      position: 'fixed',
      zIndex,
      transition: 'background-color 0.2s ease-in',
    }),
    top: ({boundingBox}) => ({
      width: '100%',
      height: boundingBox.top,
      left: '0px',
      top: '0px',
    }),
    right: ({boundingBox}) => ({
      width: window.innerWidth - boundingBox.left - boundingBox.width,
      height: boundingBox.height,
      left: boundingBox.right,
      top: boundingBox.top,
    }),
    bottom: ({boundingBox}) => ({
      width: '100%',
      height: window.innerHeight - boundingBox.top - boundingBox.height,
      left: '0px',
      top: boundingBox.bottom,
    }),
    left: ({boundingBox}) => ({
      width: boundingBox.left,
      height: boundingBox.height,
      left: '0px',
      top: boundingBox.top,
    }),
    disabled: ({boundingBox, zIndex}) => ({
      position: 'fixed',
      zIndex,
      left: boundingBox.left,
      top: boundingBox.top,
      width: boundingBox.width,
      height: boundingBox.height + 1,
    }),
  }
})

const FocusElementOverlay = ({
  contentRef,
  padding,
  offset,
  zIndex = 1300,
  adjustTopbar = true,
  onClick,
  disableClick,
}) => {

  padding = processPadding(padding)
  offset = processOffset(offset)

  const theme = useTheme()

  // this is used as a cache buster not to store the actual values
  const [ windowSize, setWindowSize ] = useState(null)
  const [ coords, setCoords ] = useState(null)
  const containerRef = useRef()

  const boundingBox = calculateBoundingBox({
    coords: coords || {},
    padding,
    offset,
  })

  const classes = useStyles({
    boundingBox,
    zIndex,
  })

  useEffect(() => {
    setTimeout(() => {
      const el = contentRef.current
      const coords = el ? el.getBoundingClientRect() : {}
      if(adjustTopbar) {
        const topbarHeight = theme && theme.layout ? theme.layout.topbarHeight : 0
        const y = coords.y || 0
        if(y < topbarHeight) {
          coords.y = topbarHeight
          coords.height -= (topbarHeight - y)
        }
      }
      setCoords(coords)
    }, 1)
  }, [
    adjustTopbar,
    contentRef.current,
  ])

  useEffect(() => {
    setTimeout(() => {
      if(!containerRef.current) return
      const divs = containerRef.current.querySelectorAll('div')
      for(let i=0; i<divs.length; i++) {
        divs[i].style.backgroundColor = 'rgba(0, 0, 0, 0.2)'
      }
    }, 100)
  }, [
    containerRef.current,
  ])

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      })
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if(!coords) return null
  
  return (
    <div className={ classes.root }>
      <div className={ classes.clicker } onClick={ onClick } ref={ containerRef }>
        <div className={ classnames(classes.panel, classes.top) }></div>
        <div className={ classnames(classes.panel, classes.right) }></div>
        <div className={ classnames(classes.panel, classes.bottom) }></div>
        <div className={ classnames(classes.panel, classes.left) }></div>
      </div>
      {
        disableClick && (
          <div className={ classes.disabled }></div>
        )
      }
    </div>
  )
}

export default FocusElementOverlay