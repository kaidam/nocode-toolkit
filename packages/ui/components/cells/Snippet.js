import React from 'react'
import useSettings from '../hooks/useSettings'

const Snippet = ({
  content,
  showUI,
}) => {
  const settings = useSettings()
  if(!content || !content.id) return
  if(!settings || !settings.snippets) return
  const snippet = settings.snippets.find(snippet => snippet.id == content.id)
  if(!snippet) return
  return (
    <div 
      dangerouslySetInnerHTML={{__html: snippet.code }}
    >
    </div>
  )
}

export default Snippet