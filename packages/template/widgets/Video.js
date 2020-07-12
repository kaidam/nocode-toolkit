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

const Render = ({
  data = {},
  cell,
}) => {
  if(!data) return null

  const id = youtubeId(data.url)
  const useStyle ={
    width: '100%',
    maxWidth: '100%',
  }

  return (
    <div style={ useStyle }>
      <YouTube id={ id } />
    </div>
  )
}

const form = {
  id: 'video',
  title: 'Video',
  initialValues: {
    url: '',
  },
  schema: [{
    id: 'url',
    title: 'URL',
    helperText: 'Enter the url of the youtube video - e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    validate: {
      type: 'string',
      methods: [
        ['required', 'The url is required'],
        ['url', 'Must be a valid youtube url - e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
      ],
    }
  }],
}

export default {
  id: 'video',
  title: 'Video',
  description: 'Embed a video from YouTube',
  Render,
  form,
}