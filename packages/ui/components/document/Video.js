import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import YouTube from 'react-youtube-embed'

const youtubeId = (url) => {
  if(!url) return null
  const match = url.match(/\?v=([\w-]+)/)
  if(match) {
    return match[1]
  }
  else {
    return url
  }
}

const useStyles = makeStyles({
  video: {
    maxWidth: '100%',
  },
  uiVideo: {
    maxWidth: 'calc(100% - 42px)',
  },
})

const DocumentVideo = ({
  content,
  showUI,
}) => {
  const classes = useStyles()
  if(!content) return null

  const id = youtubeId(content.url)

  return (
    <div className={ showUI ? classes.uiVideo : classes.video }>
      <YouTube id={ id } />
    </div>
  )
}

export default DocumentVideo