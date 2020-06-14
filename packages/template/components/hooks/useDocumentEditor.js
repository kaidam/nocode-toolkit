import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Actions from '../../utils/actions'
import contentActions from '../../store/modules/content'
import driveUtils from '../../utils/drive'
import icons from '../../icons'

import useLayoutEditor from './useLayoutEditor'

const useDocumentEditor = ({
  node,
  layout_id = 'none',
  addContentParams = {},
  addContentFilter,
}) => {

  const actions = Actions(useDispatch(), {
    onCreateRemoteContent: contentActions.createRemoteContent,
    onEditRemoteContent: contentActions.editRemoteContent,
    onHideContent: contentActions.hideContent,
    onRemoveRemoteContent: contentActions.removeRemoteContent,
  })

  const locations = useSelector(nocodeSelectors.locations)
  const isSectionContent = itemUtils.isSectionContent(node, locations)
  const openUrl = driveUtils.getItemUrl(node)
  const isFolder = driveUtils.isFolder(node)

  const {
    getAddWidgetMenu,
  } = useLayoutEditor({
    content_id: node.id,
    layout_id,
  })

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

    const baseParts = isFolder ? [{
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
    }] : []

    const widgets = [{
      title: 'Widget',
      icon: icons.widget,
      items: getAddWidgetMenu(),
    }]

    return baseParts.concat(widgets)
  }, [
    addContentParams,
    addContentFilter,
    node,
    isFolder,
  ])
  
  return {
    onOpenDrive,
    onRemove,
    onOpenSettings,
    getAddMenu,
  }
}

export default useDocumentEditor