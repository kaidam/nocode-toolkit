import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import useMenuButton from '../hooks/useMenuButton'
import Actions from '../../utils/actions'
import layoutActions from '../../store/modules/layout'

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
    header: `Widget: ${menuAnchor.title}`,
    onClick: onReset,
    onClose,
  })

  return mainMenu.menus
}

export default EditableBodyMenu