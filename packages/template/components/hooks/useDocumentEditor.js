import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import Actions from '../../utils/actions'
import contentActions from '../../store/modules/content'
import driveUtils from '../../utils/drive'
import icons from '../../icons'

import useLayoutEditor from './useLayoutEditor'

const useDocumentEditor = ({
  node,
  layout_id = 'none',
}) => {

  const actions = Actions(useDispatch(), {
    onCreateRemoteContent: contentActions.createRemoteContent,
  })

  const {
    getAddMenu,
  } = useLayoutEditor({
    content_id: node.id,
    layout_id,
  })

  const getAddContentItems = useCallback(() => {
    return [{
      title: 'Google Folder',
      icon: icons.folder,
      secondaryIcon: icons.drive,
      handler: () => actions.onCreateRemoteContent({
        title: 'Create Folder',
        driver: 'drive',
        form: 'drive.folder',
        parentId: node.id,
      })
    },{
      title: 'Google Document',
      icon: icons.docs,
      secondaryIcon: icons.drive,
      handler: () => actions.onCreateRemoteContent({
        title: 'Create Document',
        driver: 'drive',
        form: 'drive.document',
        parentId: node.id,
      })
    }]
  }, [
    node,
  ])

  const getAddItems = useCallback(() => {
    return driveUtils.isFolder(node) ?
      [{
        title: 'Content',
        icon: icons.drive,
        items: getAddContentItems(),
      }, {
        title: 'Widgets',
        icon: icons.widget,
        items: getAddMenu(),
      }] :
      getAddMenu()
  }, [
    getAddMenu,
    getAddContentItems,
    node,
  ])

  return {
    getAddContentItems,
    getAddItems,
  }
}

export default useDocumentEditor