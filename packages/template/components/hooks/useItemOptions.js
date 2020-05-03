import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import Actions from '../../utils/actions'
import contentActions from '../../store/modules/content'
import icons from '../../icons'
import driveUtils from '../../utils/drive'

const useItemOptions = ({

} = {}) => {
  const actions = Actions(useDispatch(), {
    onCreateRemoteContent: contentActions.createRemoteContent,
    onEditRemoteContent: contentActions.editRemoteContent,
    onEditLocalContent: contentActions.editLocalContent,
    onDeleteRemoteContent: contentActions.deleteRemoteContent,
    onDeleteLocalContent: contentActions.deleteLocalContent,
    onHideContent: contentActions.hideContent,
    onChangeHomepageSingleton: contentActions.changeHomepageSingleton,
  })

  const getItemOptions = useCallback(({
    node,
    getInjectedItems,
  }) => {

    const injected = getInjectedItems ?
      getInjectedItems() : []

    let items = []

    if(node.driver == 'drive') {

      const removeItem = {
        title: 'Remove',
        icon: icons.clear,
        items: [{
          title: 'Hide',
          icon: icons.hide,
          help: 'Hide this item but don\'t delete it from Google drive',
          handler: () => actions.onHideContent({
            id: node.id,
            name: node.name,
          }),
        }, {
          title: 'Delete',
          icon: icons.delete,
          help: 'Delete this item from Google drive',
          handler: () => actions.onDeleteRemoteContent({
            id: node.id,
            driver: node.driver,
            name: node.name,
          }),
        }]
      }

      const settingsItem = {
        title: 'Settings',
        icon: icons.settings,
        handler: () => actions.onEditRemoteContent({
          title: `Edit ${node.type.replace(/^\w/, st => st.toUpperCase())}`,
          driver: 'drive',
          form: `drive.${node.type}`,
          id: node.id,
        })
      }

      const openUrl = driveUtils.getItemUrl(node)
      if(node.type == 'folder') {
        items = [
          {
            title: 'View in Drive',
            icon: icons.open,
            url: openUrl,
          }, '-',
          {
            title: 'Add Content',
            icon: icons.add,
            items: [{
              title: 'Google Document',
              icon: icons.docs,
              handler: () => actions.onCreateRemoteContent({
                title: 'Create Document',
                driver: 'drive',
                form: 'drive.document',
                parentId: node.id,
              })
            },{
              title: 'Google Folder',
              icon: icons.folder,
              handler: () => actions.onCreateRemoteContent({
                title: 'Create Folder',
                driver: 'drive',
                form: 'drive.folder',
                parentId: node.id,
              })
            }],
          },
          '-',
          settingsItem,
          {
            title: 'Sorting',
            icon: icons.sort,
            handler: () => actions.onEditRemoteContent({
              title: `Edit ${node.type.replace(/^\w/, st => st.toUpperCase())}`,
              driver: 'drive',
              form: `drive.${node.type}`,
              id: node.id,
              initialTab: 'sorting',
            })
          },
          removeItem,
        ]
      }
      else {
        items = [
          {
            title: 'Edit in Drive',
            icon: icons.open,
            url: openUrl,
          }, '-',
          settingsItem,
          node.isSingletonHome ? 
            {
              title: 'Change Homepage',
              icon: icons.search,
              handler: actions.onChangeHomepageSingleton,
            } : removeItem,
        ]
      }
    }
    else {
      items = [{
        title: 'Edit',
        icon: icons.edit,
        handler: () => actions.onEditLocalContent({
          title: `Edit ${node.type.replace(/^\w/, st => st.toUpperCase())}`,
          driver: node.driver,
          form: node.type,
          id: node.id,
          location: node.location,
        })
      }, {
        title: 'Delete',
        icon: icons.delete,
        handler: () => actions.onDeleteLocalContent({
          id: node.id,
          name: node.name,
        }),
      }]
    }
    return injected.concat(items).filter(i => i)
  }, [])

  return {
    getItemOptions,
  }
}

export default useItemOptions