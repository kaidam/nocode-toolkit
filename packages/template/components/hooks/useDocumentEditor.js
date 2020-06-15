import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Actions from '../../utils/actions'
import driveUtils from '../../utils/drive'
import itemUtils from '../../utils/item'
import icons from '../../icons'

import nocodeSelectors from '../../store/selectors/nocode'
import contentActions from '../../store/modules/content'
import layoutActions from '../../store/modules/layout'

const useDocumentEditor = ({
  node,
  layouts,
  addContentParams = {},
}) => {

  const actions = Actions(useDispatch(), {
    onCreateRemoteContent: contentActions.createRemoteContent,
    onEditRemoteContent: contentActions.editRemoteContent,
    onHideContent: contentActions.hideContent,
    onRemoveRemoteContent: contentActions.removeRemoteContent,
    onAddWidget: layoutActions.addWidget,
  })

  const locations = useSelector(nocodeSelectors.locations)
  const isSectionContent = itemUtils.isSectionContent(node, locations)
  const openUrl = driveUtils.getItemUrl(node)
  const isFolder = driveUtils.isFolder(node)

  const onAddWidget = useCallback(() => {
    actions.onAddWidget({
      content_id: node.id,
      layouts,
    })
  }, [
    node,
    layouts,
  ])

  const onOpenDrive = useCallback(() => {
    window.open(openUrl)
  }, [
    openUrl,
  ])

  const onRemove = useCallback(() => {
    if(isSectionContent) {
      actions.onRemoveRemoteContent({
        id: node.id,
        name: node.name,
        driver: 'drive',
        location: node.route.location,
      })
    }
    else {
      actions.onHideContent({
        id: node.id,
        name: node.name,
      })
    }
  }, [
    isSectionContent,
    node,
  ])

  const onOpenSettings = useCallback(() => {
    actions.onEditRemoteContent({
      title: `Edit ${(node.type || 'folder').replace(/^\w/, st => st.toUpperCase())}`,
      driver: 'drive',
      form: `drive.${node.type || 'folder'}`,
      id: node.id,
    })
  }, [
    node,
  ])

  const getAddMenu = useCallback(() => {

    if(!isFolder) return []

    return [{
      id: 'document',
      title: 'Google Document',
      icon: icons.docs,
      handler: () => actions.onCreateRemoteContent({
        title: 'Create Document',
        driver: 'drive',
        form: 'drive.document',
        parentId: node.id,
        params: addContentParams,
      })
    },{
      id: 'folder',
      title: 'Google Folder',
      icon: icons.folder,
      handler: () => actions.onCreateRemoteContent({
        title: 'Create Folder',
        driver: 'drive',
        form: 'drive.folder',
        parentId: node.id,
        params: addContentParams,
      })
    },{
      title: 'Widget',
      icon: icons.widget,
      handler: onAddWidget,
    }]
  }, [
    addContentParams,
    node,
    isFolder,
    onAddWidget,
  ])
  
  return {
    isFolder,
    onOpenDrive,
    onRemove,
    onOpenSettings,
    getAddMenu,
    onAddWidget,
  }
}

export default useDocumentEditor