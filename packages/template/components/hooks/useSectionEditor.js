import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import Actions from '../../utils/actions'
import contentActions from '../../store/modules/content'

import icons from '../../icons'
import driveUtils from '../../utils/drive'

import useSection from './useSection'

const useSectionEditor = ({
  section,
}) => {
  const {
    node,
    annotation,
    ghostFolder,
    defaultFolderId,
  } = useSection({
    section,
  })

  const isDefaultFolder = ghostFolder && ghostFolder.id == defaultFolderId

  const actions = Actions(useDispatch(), {
    onCreateRemoteContent: contentActions.createRemoteContent,
    onCreateLocalContent: contentActions.createLocalContent,
    onEditSection: contentActions.editSection,
    onChangeSectionFolder: contentActions.editSectionFolder,
    onResetSectionFolder: contentActions.resetSectionFolder,
  })

  const getAddItems = useCallback(() => {

    const linkItem = {
      title: 'Link',
      icon: icons.link,
      handler: () => actions.onCreateLocalContent({
        title: 'Create Link',
        form: 'link',
        location: `section:${section}`,
      })
    }

    return ghostFolder ? [{
      title: 'Google Document',
      icon: icons.docs,
      secondaryIcon: icons.drive,
      handler: () => actions.onCreateRemoteContent({
        title: 'Create Document',
        driver: 'drive',
        form: 'drive.document',
        parentId: ghostFolder.id,
      })
    }, {
      title: 'Google Folder',
      icon: icons.folder,
      secondaryIcon: icons.drive,
      handler: () => actions.onCreateRemoteContent({
        title: 'Create Folder',
        driver: 'drive',
        form: 'drive.folder',
        parentId: ghostFolder.id,
      })
    }, linkItem] : [linkItem]
  }, [
    ghostFolder,
  ])
  
  const getSettingsItems = useCallback(() => {
    return [


      {
        title: 'Add Content',
        icon: icons.add,
        items: getAddItems(),
      },

      '-',

      ghostFolder ? {
        title: 'View in Drive',
        icon: icons.open,
        secondaryIcon: icons.drive,
        url: driveUtils.getItemUrl(ghostFolder),
      } : null,

      ghostFolder ? {
        title: 'Change Drive Folder',
        icon: icons.search,
        secondaryIcon: icons.drive,
        handler: () => actions.onChangeSectionFolder({
          id: section,
        })
      } : null,

      ghostFolder && !isDefaultFolder ? {
        title: 'Reset Drive Folder',
        icon: icons.refresh,
        secondaryIcon: icons.drive,
        handler: () => actions.onResetSectionFolder({
          id: section,
        })
      } : null,

      ghostFolder ? '-' : null,
      
      
      {
        title: 'Sorting',
        icon: icons.sort,
        handler: () => actions.onEditSection({
          title: `Edit Section`,
          form: `section`,
          id: section,
          initialTab: 'sorting'
        })
      },

      {
        title: 'Hidden Items',
        icon: icons.hide,
        handler: () => actions.onEditSection({
          title: `Edit Section`,
          form: `section`,
          id: section,
          initialTab: 'hidden'
        })
      },

    ].filter(i => i)
  }, [
    ghostFolder,
    isDefaultFolder,
    getAddItems,
  ])
  
  return {
    node,
    annotation,
    ghostFolder,
    getAddItems,
    getSettingsItems,
  }
}

export default useSectionEditor