import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Actions from '../../utils/actions'
import contentActions from '../../store/modules/content'

import icons from '../../icons'
import driveUtils from '../../utils/drive'

import useSection from './useSection'
import settingsSelectors from '../../store/selectors/settings'

const useSectionEditor = ({
  section,
}) => {
  const {
    node,
    annotation,
    addTargetFolderId,
  } = useSection({
    section,
  })

  const {
    driveMode,
  } = useSelector(settingsSelectors.settings)

  const isAdvancedDrive = driveMode == 'advanced'

  const actions = Actions(useDispatch(), {
    onCreateRemoteContent: contentActions.createRemoteContent,
    onCreateLocalContent: contentActions.createLocalContent,
    onEditSection: contentActions.editSection,
    openManageFoldersDialog: contentActions.openManageFoldersDialog,
  })

  const getAddItems = useCallback(() => {

    const link = {
      title: 'Link',
      icon: icons.link,
      handler: () => actions.onCreateLocalContent({
        title: 'Create Link',
        form: 'link',
        location: `section:${section}`,
      })
    }

    const newDocumentHandler = () => actions.onCreateRemoteContent({
      title: 'Create Document',
      driver: 'drive',
      form: 'drive.document',
      parentId: addTargetFolderId,
    })

    const existingDocumentHandler = () => {}

    const newFolderHandler = () => actions.onCreateRemoteContent({
      title: 'Create Folder',
      driver: 'drive',
      form: 'drive.folder',
      parentId: addTargetFolderId,
    })

    const existingFolderHandler = () => {}

    const document = {
      title: 'Google Document',
      icon: icons.docs,
    }

    const folder = {
      title: 'Google Folder',
      icon: icons.folder,
    }

    if(isAdvancedDrive) {
      document.items = [{
        title: 'New Google Document',
        icon: icons.docs,
        secondaryIcon: icons.add,
        handler: newDocumentHandler,
      }, {
        title: 'Existing Google Document',
        icon: icons.docs,
        secondaryIcon: icons.search,
        handler: existingDocumentHandler,
      }]

      folder.items = [{
        title: 'New Google Folder',
        icon: icons.folder,
        secondaryIcon: icons.add,
        handler: newFolderHandler,
      }, {
        title: 'Existing Google Folder',
        icon: icons.folder,
        secondaryIcon: icons.search,
        handler: existingFolderHandler,
      }]
    }
    else {
      document.handler = newDocumentHandler
      folder.handler = newFolderHandler
    }

    return [
      document,
      folder,
      link,
    ]
  }, [
    isAdvancedDrive,
    addTargetFolderId,
  ])
  
  const getSettingsItems = useCallback(() => {
    return [


      {
        title: 'Add Content',
        icon: icons.add,
        items: getAddItems(),
      },

      '-',

      isAdvancedDrive ? {
        title: 'Manage Drive Folders',
        icon: icons.folder,
        secondaryIcon: icons.drive,
        handler: () => actions.openManageFoldersDialog({
          section,
        })
      } : null,

      isAdvancedDrive ? '-' : null,
      
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
    getAddItems,
    isAdvancedDrive,
  ])
  
  return {
    node,
    annotation,
    getAddItems,
    getSettingsItems,
  }
}

export default useSectionEditor