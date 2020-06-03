import React, { useRef, useEffect, useState } from 'react'
import classnames from 'classnames'
import { makeStyles, useTheme } from '@material-ui/core/styles'

const HIGHLIGHT_BORDER = `0.5px solid #666`

const useStyles = makeStyles(theme => {
  return {
    root: {
      
    },
    clicker: {
      
    },
    panel: ({coords, padding, zIndex}) => ({
      backgroundColor: 'rgba(0, 0, 0, 0)',
      //backdropFilter: 'blur(10px)',
      position: 'absolute',
      zIndex,
      transition: 'background-color 0.2s ease-in',
    }),
    border: ({coords, padding, zIndex}) => ({
      position: 'absolute',
      zIndex,
    }),
    top: ({coords, padding}) => ({
      width: '100%',
      height: coords.y - (padding.top ? padding.top : 0),
      left: '0px',
      top: '0px',
    }),
    right: ({coords, padding}) => ({
      width: window.innerWidth - coords.x - coords.width - (padding.right ? padding.right : 0),
      height: coords.height + (padding.top ? padding.top : 0) + (padding.bottom ? padding.bottom : 0),
      left: coords.x + coords.width + (padding.right ? padding.right : 0),
      top: coords.y - (padding.top ? padding.top : 0),
    }),
    bottom: ({coords, padding}) => ({
      width: '100%',
      height: window.innerHeight - coords.y - coords.height - (padding.bottom ? padding.bottom : 0),
      left: '0px',
      top: coords.y + coords.height + (padding.bottom ? padding.bottom : 0),
    }),
    left: ({coords, padding}) => ({
      width: coords.x - (padding.left ? padding.left : 0),
      height: coords.height + (padding.top ? padding.top : 0) + (padding.bottom ? padding.bottom : 0),
      left: '0px',
      top: coords.y - (padding.top ? padding.top : 0),
    }),
    borderTop: ({coords, padding}) => ({
      width: coords.width + (padding.left ? padding.left : 0) + (padding.right ? padding.right : 0),
      height: 1,
      left: coords.x - (padding.left ? padding.left : 0),
      top: coords.y - (padding.top ? padding.top : 0),
      borderBottom: HIGHLIGHT_BORDER,
    }),
    borderBottom: ({coords, padding}) => ({
      width: coords.width + (padding.left ? padding.left : 0) + (padding.right ? padding.right : 0),
      height: 1,
      left: coords.x - (padding.left ? padding.left : 0),
      top: coords.y + (padding.bottom ? padding.bottom : 0) + coords.height,
      borderTop: HIGHLIGHT_BORDER,
    }),
    borderLeft: ({coords, padding}) => ({
      width: 1,
      height: coords.height + 1 + (padding.top ? padding.top : 0) + (padding.bottom ? padding.bottom : 0),
      left: coords.x - (padding.left ? padding.left : 0),
      top: coords.y - (padding.top ? padding.top : 0),
      borderRight: HIGHLIGHT_BORDER,
    }),
    borderRight: ({coords, padding}) => ({
      width: 1,
      height: coords.height + 1 + (padding.top ? padding.top : 0) + (padding.bottom ? padding.bottom : 0),
      left: coords.x + (padding.left ? padding.left : 0) + coords.width,
      top: coords.y - (padding.top ? padding.top : 0),
      borderLeft: HIGHLIGHT_BORDER,
    }),
    disabled: ({coords, padding, zIndex}) => ({
      position: 'absolute',
      zIndex,
      left: coords.x - (padding.left ? padding.left : 0),
      top: coords.y - (padding.top ? padding.top : 0),
      width: coords.width + (padding.left ? padding.left : 0) + (padding.right ? padding.right : 0),
      height: coords.height + 1 + (padding.top ? padding.top : 0) + (padding.bottom ? padding.bottom : 0),
    }),
  }
})

const FocusElementOverlay = ({
  contentRef,
  padding = {},
  zIndex = 1300,
  onClick,
  disableClick,
}) => {
  const [ windowSize, setWindowSize ] = useState(null)
  const containerRef = useRef()
  const el = contentRef.current
  const coords = el ? el.getBoundingClientRect() : {}
  const theme = useTheme()
  const topbarHeight = theme && theme.layout ? theme.layout.topbarHeight : 0
  const y = coords.y || 0
  if(y < topbarHeight) {
    coords.y = topbarHeight
    coords.height -= (topbarHeight - y)
  }
  const classes = useStyles({
    coords,
    padding,
    zIndex,
  })
  useEffect(() => {
    setTimeout(() => {
      if(!containerRef.current) return
      const divs = containerRef.current.querySelectorAll('div')
      for(let i=0; i<divs.length; i++) {
        divs[i].style.backgroundColor = 'rgba(0, 0, 0, 0.2)'
      }
    }, 1)
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

  if(!el) return null
  
  return (
    <div className={ classes.root }>
      <div className={ classes.clicker } onClick={ onClick } ref={ containerRef }>
        <div className={ classnames(classes.panel, classes.top) }></div>
        <div className={ classnames(classes.panel, classes.right) }></div>
        <div className={ classnames(classes.panel, classes.bottom) }></div>
        <div className={ classnames(classes.panel, classes.left) }></div>
        <div className={ classnames(classes.border, classes.borderTop) }></div>
        <div className={ classnames(classes.border, classes.borderRight) }></div>
        <div className={ classnames(classes.border, classes.borderBottom) }></div>
        <div className={ classnames(classes.border, classes.borderLeft) }></div>
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