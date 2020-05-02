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
  }
})

const FocusElementOverlay = ({
  contentRef,
  padding = {},
}) => {
  const containerRef = useRef()
  const el = contentRef.current
  const coords = el.getBoundingClientRect()
  const theme = useTheme()
  const topbarHeight = theme && theme.layout ? theme.layout.topbarHeight : 0
  const y = coords.y
  if(y < topbarHeight) {
    coords.y = topbarHeight
    coords.height -= (topbarHeight - y)
  }
  const classes = useStyles({
    coords,
    padding,
  })
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