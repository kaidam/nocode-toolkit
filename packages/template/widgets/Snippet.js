import React from 'react'
import { useSelector } from 'react-redux'

import settingsSelectors from '../store/selectors/settings'
import HTML from '../components/widgets/HTML'

import icons from '../icons'

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

export default {
  id: 'snippet',
  title: 'Snippet',
  description: 'Render a snippet of code you have added to your website',
  Render,
  locations: ['document', 'section'],
  group: 'Content',
  icon: icons.code,
  // we explode the actual page snippets
  // into an array of these options
  hidden: true,
}