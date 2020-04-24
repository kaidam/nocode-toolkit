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
      title: 'Google Folder',
      icon: icons.folder,
      secondaryIcon: icons.drive,
      handler: () => actions.onCreateRemoteContent({
        title: 'Create Folder',
        driver: 'drive',
        form: 'drive.folder',
        parentId: ghostFolder.id,
      })
    },{
      title: 'Google Document',
      icon: icons.docs,
      secondaryIcon: icons.drive,
      handler: () => actions.onCreateRemoteContent({
        title: 'Create Document',
        driver: 'drive',
        form: 'drive.document',
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

      {
        title: 'Edit Section',
        icon: icons.edit,
        handler: () => actions.onEditSection({
          title: `Edit Section`,
          form: `section`,
          id: section,
        })
      },

      ghostFolder ? {
        title: 'Folder Settings',
        icon: icons.settings,
        secondaryIcon: icons.drive,
        items: [
          {
            title: 'Open in Drive',
            icon: icons.open,
            secondaryIcon: icons.drive,
            url: driveUtils.getItemUrl(ghostFolder),
          },
          {
            title: 'Change Drive Folder',
            icon: icons.search,
            secondaryIcon: icons.drive,
            handler: () => actions.onChangeSectionFolder({
              id: section,
            })
          },
          isDefaultFolder ? null : {
            title: 'Reset Drive Folder',
            icon: icons.refresh,
            secondaryIcon: icons.drive,
            handler: () => actions.onResetSectionFolder({
              id: section,
            })
          }
        ].filter(i => i)
      } : null,

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