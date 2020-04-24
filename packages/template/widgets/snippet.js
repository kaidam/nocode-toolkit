import React from 'react'
import { useSelector } from 'react-redux'

import settingsSelectors from '../store/selectors/settings'
import HTML from '../components/widgets/HTML'

const Render = ({
  data,
}) => {
  const snippets = useSelector(settingsSelectors.pageSnippets)
  data = data || {}
  const id = data.id
  const snippet = snippets.find(s => s.id == id)
  if(!snippet) return null
  return (
    <HTML
      html={ snippet.code }
    />
  )
}

const widget = () => ({
  id: 'snippet',
  title: 'Snippet',
  Render,
})

export default widget