import { useCallback } from 'react'
import useMenuButton from '../hooks/useMenuButton'

import icons from '../../icons'
import driveUtils from '../../utils/drive'

import useDocumentEditor from '../hooks/useDocumentEditor'

const AddIcon = icons.add
const EditIcon = icons.edit
const SettingsIcon = icons.settings
const OpenIcon = icons.open

const EditableBodyMenu = ({
  node,
  layout_id,
  menuAnchor,
  onClose,
  onReset,
}) => {

  const {
    getAddItems,
    onOpenSettings,
    onOpenItem,
    onEditItem,
  } = useDocumentEditor({
    node,
    layout_id,
  })

  const isFolder = driveUtils.isFolder(node)

  const getMenuItems = useCallback(() => {
    return [
      isFolder ? {
        title: 'Edit',
        icon: EditIcon,
        handler: onEditItem,
      } : null,
      {
        title: isFolder ?
          'Open Google Folder' :
          'Edit Google Document',
        icon: isFolder ?
          OpenIcon :
          EditIcon,
        handler: onOpenItem,
      },
      
      {
        title: 'Add',
        icon: AddIcon,
        items: getAddItems(),
      },
      
      {
        title: 'Settings',
        icon: SettingsIcon,
        handler: onOpenSettings,
      }
    ].filter(i => i)
  }, [
    isFolder,
    onEditItem,
    onOpenItem,
    getAddItems,
    onOpenSettings,
  ])

  const mainMenu = useMenuButton({
    parentAnchorEl: menuAnchor.el,
    anchorPosition: menuAnchor ? {
      left: menuAnchor.x,
      top: menuAnchor.y,
    } : null,
    getItems: getMenuItems,
    header: `Google Document`,
    onClick: onReset,
    onClose,
  })

  return mainMenu.menus
}

export default EditableBodyMenu