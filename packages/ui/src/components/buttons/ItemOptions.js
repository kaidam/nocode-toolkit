import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createSelector } from 'reselect'

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
  onOpen,
  onClose,
}) => {

  const menuItems = useMemo(
    () => {
      return typeUI.addContentOptions({
        filter: parentFilter => parentFilter.indexOf('home') >= 0,
        location: `singleton:home`,
        structure: 'list',
        onOpenContentForm: actions.onOpenContentForm,
        onOpenFinder: actions.onOpenFinder,
      })
    },
    [
      actions,
    ]
  )

  return (
    <MenuButton
      items={ menuItems }
      getButton={ onClick => (
        <IconButton
          size="small"
          onClick={ onClick }
        >
          <MoreVertIcon
            className={ iconClassName }
          />
        </IconButton>
      )}
      onOpen={ onOpen }
      onClose={ onClose }
    />
  )
}

const ItemMenuButtonContent = ({
  item,
  iconClassName,
  parentAnchorEl,
  actions,
  onOpen,
  onClose,
}) => {

  const ghostParent = useSelector(state => {
    if(!item.location.ghostParent) return null
    return selectors.nocode.item(state, 'content', item.location.ghostParent)
  })

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
          filter: parentFilter => parentFilter.indexOf(parentType) >= 0,
          location: `item:${item.id}`,
          structure: 'tree',
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
      // this item is a descendent of a ghost item in the content table
      else if(isGhostDescendant && ghostParent) {
        menuItems.push({
          title: `Remove Parent`,
          help: `Remove the ${ghostParent.data.name} folder and all children`,
          icon: DeleteIcon,
          handler: () => actions.onRemoveItem({item}),
        })
      }

      // this item is a descendant of an item in the content table
      // we can't remove it - just "hide" it
      if(!isRootContent) {
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
      ghostParent,
    ]
  )

  return (
    <MenuButton
      items={ menuItems }
      header={(
        <strong>{ item.data.name }</strong>
      )}
      parentAnchorEl={ parentAnchorEl }
      getButton={ onClick => (
        <IconButton
          size="small"
          onClick={ onClick }
        >
          <MoreVertIcon
            className={ iconClassName }
          />
        </IconButton>
      )}
      onOpen={ onOpen }
      onClose={ onClose }
    />
  )
}

const ItemMenuButton = ({
  item,
  parentAnchorEl,
  iconClassName,
  onOpen,
  onClose,
}) => {
  
  const actions = Actions(useDispatch(), {
    onOpenContentForm: contentActions.openDialogContentForm,
    onOpenExternalEditor: contentActions.onOpenExternalEditor,
    onOpenFinder: finderActions.openDialogFinder,
    onRemoveItem: contentActions.removeContent,
    onHideItem: contentActions.hideContent,
  })

  if(item.id == 'home') {
    return (
      <ItemMenuButtonHome
        iconClassName={ iconClassName }
        actions={ actions }
        onOpen={ onOpen }
        onClose={ onClose }
      />
    )
  }
  else {
    return (
      <ItemMenuButtonContent
        item={ item }
        iconClassName={ iconClassName }
        parentAnchorEl={ parentAnchorEl }
        actions={ actions }
        onOpen={ onOpen }
        onClose={ onClose }
      />
    )
  }
}

export default ItemMenuButton