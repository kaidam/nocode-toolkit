import React, { lazy, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Body from '../components/document/Body'
import Folder from '../components/document/Folder'
import Suspense from '../components/system/Suspense'

import driveUtils from '../utils/drive'
import contentSelectors from '../store/selectors/content'
import documentActions from '../store/modules/document'

const DefaultHome = lazy(() => import(/* webpackChunkName: "ui" */ '../components/document/DefaultHome'))

const Render = ({
  
}) => {

  const dispatch = useDispatch()

  const {
    node,
    html,
    cssImports,
  } = useSelector(contentSelectors.document)

  useEffect(() => {
    dispatch(documentActions.addCssImports(cssImports))
  }, [
    cssImports,
  ])

  if(node.type == 'defaultHome') {
    return (
      <Suspense
        Component={ DefaultHome }
      />
    )
  }

  return driveUtils.isFolder(node) ? (
    <Folder
      node={ node }
    />
  ) : (
    <Body
      node={ node }
      html={ html }
    />
  )
}

export default {
  id: 'documentContent',
  title: 'Document Content',
  description: 'The content of the document',
  editable: false,
  Render,
}