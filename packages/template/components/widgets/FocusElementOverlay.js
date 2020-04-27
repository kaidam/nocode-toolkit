import React, { useRef, useEffect } from 'react'
import classnames from 'classnames'
import { makeStyles, useTheme } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => {
  return {
    root: {
      
    },
    panel: {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      //backdropFilter: 'blur(10px)',
      position: 'absolute',
      zIndex: 1300,
      transition: 'background-color 0.2s ease-in',
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
  const containerRef = useRef()
  const el = contentRef.current
  const coords = el.getBoundingClientRect()
  const theme = useTheme()
  const topbarHeight = theme.layout.topbarHeight
  const y = coords.y
  if(y < topbarHeight) {
    coords.y = topbarHeight
    coords.height -= (topbarHeight - y)
  }
  const classes = useStyles({coords})
  useEffect(() => {
    if(!containerRef.current) return
    setTimeout(() => {
      const divs = containerRef.current.querySelectorAll('div')
      for(let i=0; i<divs.length; i++) {
        divs[i].style.backgroundColor = 'rgba(0, 0, 0, 0.2)'
      }
    }, 1)
    
  }, [
    containerRef.current,
  ])
  return (
    <div className={ classes.root } ref={ containerRef }>
      <div className={ classnames(classes.panel, classes.top) }></div>
      <div className={ classnames(classes.panel, classes.right) }></div>
      <div className={ classnames(classes.panel, classes.bottom) }></div>
      <div className={ classnames(classes.panel, classes.left) }></div>
    </div>
  )
}

export default FocusElementOverlay