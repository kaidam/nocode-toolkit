import React, { useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import IconButton from '@material-ui/core/IconButton'

import Actions from '../../utils/actions'
import icons from '../../icons'
import contentActions from '../../store/modules/content'
import finderActions from '../../store/modules/finder'
import selectors from '../../store/selectors'
import itemTypes from '../../types/item'
import typeUI from '../../types/ui'

import MenuButton from './MenuButton'

const MoreVertIcon = icons.moreVert
const AddIcon = icons.add
const EditIcon = icons.edit
const OpenIcon = icons.open
const DeleteIcon = icons.delete
const HideIcon = icons.hide

const ItemMenuButtonHome = ({
  iconClassName,
  actions,
  getButton,
  groupFilter,
  onOpen,
  onClose,
}) => {

  const defaultGetButton = useCallback(onClick => (
    <IconButton
      size="small"
      onClick={ onClick }
    >
      <MoreVertIcon
        className={ iconClassName }
      />
    </IconButton>
  ), [iconClassName])

  const menuItems = useMemo(
    () => {
      return typeUI.addContentOptions({
        filter: parentFilter => parentFilter.indexOf('home') >= 0,
        location: `singleton:home`,
        structure: 'list',
        groupFilter,
        onOpenContentForm: actions.onOpenContentForm,
        onOpenFinder: actions.onOpenFinder,
      })
    },
    [
      actions,
      groupFilter,
    ]
  )

  getButton = getButton || defaultGetButton

  return (
    <MenuButton
      items={ menuItems }
      getButton={ getButton }
      onOpen={ onOpen }
      onClose={ onClose }
    />
  )
}

const ItemMenuButtonContent = ({
  item,
  groupFilter,
  iconClassName,
  parentAnchorEl,
  actions,
  getButton,
  onOpen,
  onClose,
}) => {

  const ghostParentSelector = useMemo(selectors.content.ghostParent, [])
  const ghostParent = useSelector(state => ghostParentSelector(state, item))

  const menuItems = useMemo(
    () => {
      const itemType = itemTypes(item)
      const hasChildren = itemType.hasChildren(item)
      const isRootContent = itemType.isRootContent(item)
      const isGhostDescendant = itemType.isGhostDescendant(item)
      const isEditable = itemType.isEditable(item)
      const isOpenable = itemType.isOpenable(item)

      const menuItems = []

      if(hasChildren) {
        const parentType = [item.driver, item.type].join('.')
        const addChildMenuItems = typeUI.addContentOptions({
          driver: item.driver,
          type: item.type,
          filter: parentFilter => parentFilter.indexOf(parentType) >= 0,
          location: `item:${item.id}`,
          structure: 'tree',
          groupFilter,
          onOpenContentForm: actions.onOpenContentForm,
          onOpenFinder: actions.onOpenFinder,
        })
        menuItems.push({
          title: 'Add',
          help: `Add content inside this item`,
          icon: AddIcon,
          items: addChildMenuItems,
        })
      }

      if(isEditable) {
        menuItems.push({
          title: 'Edit',
          help: `Edit this item`,
          icon: EditIcon,
          handler: typeUI.editContentHandler({
            item,
            location: `item:${item.id}`,
            structure: 'tree',
            onOpenContentForm: actions.onOpenContentForm,
            onOpenExternalEditor: actions.onOpenExternalEditor,
          }),
        })
      }

      if(isOpenable) {
        const driverName = itemType.driverName(item)
        menuItems.push({
          title: 'Open',
          help: `Open this item with ${driverName}`,
          icon: OpenIcon,
          handler: () => itemType.handleOpen(item),
        })
      }

      // this item is an actual entry in the content table
      if(isRootContent) {
        menuItems.push({
          title: 'Remove',
          help: `Remove this item from the website`,
          icon: DeleteIcon,
          handler: () => actions.onRemoveItem({item}),
        })
      }
      // this item is a descendant of an item in the content table
      // we can't remove it - just "hide" it
      else {
        menuItems.push({
          title: 'Delete',
          help: `Delete this item permenantly`,
          icon: DeleteIcon,
          handler: () => actions.onDeleteItem({item}),
        })
        menuItems.push({
          title: 'Hide',
          help: `Don't show this item when the website is published`,
          icon: HideIcon,
          handler: () => actions.onHideItem({item}),
        })
      }

      return menuItems
    },
    [
      actions,
      item,
      groupFilter,
      ghostParent,
    ]
  )

  const defaultGetButton = useCallback(onClick => (
    <IconButton
      size="small"
      onClick={ onClick }
    >
      <MoreVertIcon
        className={ iconClassName }
      />
    </IconButton>
  ), [iconClassName])

  getButton = getButton || defaultGetButton

  return (
    <MenuButton
      items={ menuItems }
      header={(
        <strong>{ item.data.name }</strong>
      )}
      parentAnchorEl={ parentAnchorEl }
      getButton={ getButton }
      onOpen={ onOpen }
      onClose={ onClose }
    />
  )
}

const ItemMenuButton = ({
  item,
  groupFilter,
  parentAnchorEl,
  iconClassName,
  getButton,
  onOpen,
  onClose,
}) => {
  
  const actions = Actions(useDispatch(), {
    onOpenContentForm: contentActions.openDialogContentForm,
    onOpenExternalEditor: contentActions.onOpenExternalEditor,
    onOpenFinder: finderActions.openDialogFinder,
    onRemoveItem: contentActions.removeContent,
    onDeleteItem: finderActions.deleteItem,
    onHideItem: contentActions.hideContent,
  })

  if(item.id == 'home') {
    return (
      <ItemMenuButtonHome
        groupFilter={ groupFilter }
        iconClassName={ iconClassName }
        actions={ actions }
        getButton={ getButton }
        onOpen={ onOpen }
        onClose={ onClose }
      />
    )
  }
  else {
    return (
      <ItemMenuButtonContent
        item={ item }
        groupFilter={ groupFilter }
        iconClassName={ iconClassName }
        parentAnchorEl={ parentAnchorEl }
        getButton={ getButton }
        actions={ actions }
        onOpen={ onOpen }
        onClose={ onClose }
      />
    )
  }
}

export default ItemMenuButton