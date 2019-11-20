import React from 'react'
import Title from './Title'
import HTML from './HTML'
import RichText from './RichText'
import Image from './Image'
import Video from './Video'

const BlankContent = () => ''

const CELLS = {
  title: {
    component: Title,
    padding: 1,
  },
  html:  {
    component: HTML,
    padding: 2,
  },
  richtext:  {
    component: RichText,
    padding: 1,
    compactEditor: true,
    noScrollEditor: true,
    fullHeightEditor: true,
  },
  image:  {
    component: Image,
  },
  youtube:  {
    component: Video,
  },
  blank:  {
    component: BlankContent,
    padding: 1,
  },
}

const getType = cell => CELLS[cell.component] || CELLS.blank
const getContent = ({
  cell,
  data,
}) => {
  if(cell.source == 'title') return {
    title: data.item.data.name,
  }
  if(cell.source == 'external') return data.externals[cell.index]
  if(cell.source == 'cell') return cell.data
  return ''
}

const cellTypes = {
  getType,
  getContent,
}

export default cellTypes