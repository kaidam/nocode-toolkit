import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  img: {
    width: '100%',
  },
  uiImg: {
    maxWidth: 'calc(100% - 42px)',
  },
})

const DocumentImage = ({
  content,
  showUI,
}) => {
  const classes = useStyles()
  if(!content) return null
  return (
    <img className={ showUI ? classes.uiImg : classes.img } src={ content.image.url } />
  )
}

export default DocumentImage