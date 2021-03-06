import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import icons from '../../icons'

import Actions from '../../utils/actions'
import contentActions from '../../store/modules/content'
import formActions from '../../store/modules/form'
import nocodeSelectors from '../../store/selectors/nocode'
import settingsSelectors from '../../store/selectors/settings'
import driveUtils from '../../utils/drive'
import itemUtils from '../../utils/item'
import { isTouchscreen } from '../../utils/browser' 

const useItemEditor = ({
  node,
  // is the folder currently open
  isOpen,
  // this is for the "open page / open folder handler"
  onOpenItem,
}) => {

  let outerNode = node

  const actions = Actions(useDispatch(), {
    onCreateContent: formActions.createContent,
    onEditContent: formActions.editContent,
    onDeleteContent: formActions.deleteContent,
    onRemoveSectionContent: contentActions.removeSectionContent,
    onHideContent: contentActions.hideContent,
  })

  const locations = useSelector(nocodeSelectors.locations)
  const settings = useSelector(settingsSelectors.settings)
  const folderPages = settings.folderPages === 'yes'

  const getItemOptions = useCallback(({
    node,
    getInjectedItems,
  }) => {

    node = node || outerNode

    const isSectionContent = itemUtils.isSectionContent(node, locations)

    const injected = getInjectedItems ?
      getInjectedItems() : []

    let items = []

    if(node.driver == 'drive') {
      const removeItem = isSectionContent ? {
        title: 'Remove',
        icon: icons.clear,
        handler: () => actions.onRemoveSectionContent({
          title: node.name,
          driver: 'drive',
          section: node.route.location.split(':')[1],
          content_id: node.id,
        })
      } : {
        title: 'Hide',
        icon: icons.clear,
        handler: () => actions.onHideContent({
          id: node.id,
          name: node.name,
        }),
      }
      
      const settingsItem = {
        title: 'Settings',
        icon: icons.settings,
        handler: () => actions.onEditContent({
          title: `Edit ${(node.type || 'folder').replace(/^\w/, st => st.toUpperCase())}`,
          driver: 'drive',
          form: `drive.${node.type || 'folder'}`,
          content_id: node.id,
        })
      }

      const openUrl = driveUtils.getItemUrl(node)
      if(node.type == 'folder') {
        items = [
          {
            title: 'Create Content',
            icon: icons.add,
            items: [{
              title: 'Create Document',
              icon: icons.docs,
              handler: () => actions.onCreateContent({
                title: 'Create Document',
                driver: 'drive',
                form: 'drive.document',
                parentId: node.id,
              })
            },{
              title: 'Create Folder',
              icon: icons.folder,
              handler: () => actions.onCreateContent({
                title: 'Create Folder',
                driver: 'drive',
                form: 'drive.folder',
                parentId: node.id,
              })
            }],
          },
          '-',
          settingsItem,
          removeItem,
          {
            title: 'View in Drive',
            icon: icons.open,
            url: openUrl,
          }
        ]
      }
      else {
        items = [
          settingsItem,
          removeItem,
          {
            title: 'Edit in Drive',
            icon: icons.open,
            url: openUrl,
          }
        ]
      }
    }
    else {
      items = [{
        title: 'Edit',
        icon: icons.edit,
        handler: () => actions.onEditContent({
          title: `Edit ${(node.type || '').replace(/^\w/, st => st.toUpperCase())}`,
          driver: node.driver,
          form: node.type,
          content_id: node.id,
        })
      }, {
        title: 'Delete',
        icon: icons.delete,
        handler: () => actions.onDeleteContent({
          title: node.name,
          driver: node.driver,
          content_id: node.id,
        }),
      }]
    }
    return injected.concat(items).filter(i => i)
  }, [
    locations,
  ])

  const getEditorItems = useCallback(() => {

    if(!node) return []

    let title = 'Open Page'
    let icon = icons.forward

    const isFolder = node.type == 'folder'

    if(isFolder) {
      // if we don't have folder pages
      // it means we are toggling the state of the menu
      if(!folderPages) {
        icon = isOpen ?
          icons.expandLess :
          icons.expandMore
        title = isOpen ?
          'Collapse Folder' :
          'Expand Folder'
      }
      else {
        title = 'Open Page'
      }
    }
    return getItemOptions({
      node,
      getInjectedItems: () => {
        return onOpenItem && isTouchscreen() ?
          [{
            title,
            icon,
            handler: onOpenItem,
          }, '-'] :
          []
      }
    })
  }, [
    getItemOptions,
    node,
    isOpen,
    folderPages,
    onOpenItem,
  ])

  return {
    folderPages,
    getItemOptions,
    getEditorItems,
  }
}

export default useItemEditor