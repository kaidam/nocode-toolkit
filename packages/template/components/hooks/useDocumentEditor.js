import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Actions from '../../utils/actions'
import driveUtils from '../../utils/drive'
import icons from '../../icons'

import nocodeSelectors from '../../store/selectors/nocode'
import layoutActions from '../../store/modules/layout'
import formActions from '../../store/modules/form'

const useDocumentEditor = ({
  node,
}) => {

  const annotations = useSelector(nocodeSelectors.annotations)
  const annotation = annotations[node.id] || {}

  const actions = Actions(useDispatch(), {
    onCreateContent: formActions.createContent,
    onEditContent: formActions.editContent,
    onEditLayout: layoutActions.openLayoutWindow,
  })

  const openUrl = driveUtils.getItemUrl(node)
  const isFolder = driveUtils.isFolder(node)

  const onAddWidget = useCallback(() => {
    actions.onAddWidget({
      content_id: node.id,
      layouts: [],
    })
  }, [
    node,
  ])

  const onOpenDrive = useCallback(() => {
    window.open(openUrl)
  }, [
    openUrl,
  ])

  const onOpenSettings = useCallback(() => {

    const form = annotation && annotation.form ?
      annotation.form :
      `drive.${node.type || 'folder'}`

    actions.onEditContent({
      title: `Edit ${(node.type || 'folder').replace(/^\w/, st => st.toUpperCase())}`,
      driver: 'drive',
      form,
      content_id: node.id,
    })
  }, [
    node,
    annotation,
  ])

  const getAddMenu = useCallback(() => {

    if(!isFolder) return []

    return [{
      id: 'document',
      title: 'Google Document',
      icon: icons.docs,
      handler: () => actions.onCreateContent({
        title: 'Create Document',
        driver: 'drive',
        form: 'drive.document',
        parentId: node.id,
      })
    },{
      id: 'folder',
      title: 'Google Folder',
      icon: icons.folder,
      handler: () => actions.onCreateContent({
        title: 'Create Folder',
        driver: 'drive',
        form: 'drive.folder',
        parentId: node.id,
      })
    }]
  }, [
    node,
    isFolder,
    onAddWidget,
  ])
  
  return {
    isFolder,
    onOpenDrive,
    onOpenSettings,
    getAddMenu,
    onAddWidget,
    onEditLayout: () => actions.onEditLayout(),
  }
}

export default useDocumentEditor