import React from 'react'
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

const DocumentVideo = ({
  content,
  showUI,
}) => {
  if(!content) return null

  const id = youtubeId(content.url)
  const useStyle = showUI ? {
    maxWidth: 'calc(100% - 42px)',
  } : {
    maxWidth: '100%',
  }

  return (
    <div style={ useStyle }>
      <YouTube id={ id } />
    </div>
  )
}

export default DocumentVideo