import React, { lazy, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Body from '../components/document/Body'
import Folder from '../components/document/Folder'
import Suspense from '../components/system/Suspense'

import driveUtils from '../utils/drive'
import contentSelectors from '../store/selectors/content'
import documentActions from '../store/modules/document'

import icons from '../icons'

const DefaultHome = lazy(() => import(/* webpackChunkName: "ui" */ '../components/document/DefaultHome'))

const Render = ({
  cellProps = {},
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
  locations: ['document'],
  group: 'Content',
  Render,
  icon: icons.documentContent,
  // there is no initial data to gather
  editable: false,
  // this is always rendered and can't be added
  hidden: true,
  // this cannot be deleted
  deletable: false,
  // this will not render normal contents when in editable mode
  editablePlaceHolder: `Document content will render here...`,
}