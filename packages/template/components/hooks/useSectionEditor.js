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
    defaultFolderId,
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
    onChangeSectionFolder: contentActions.editSectionFolder,
    onResetSectionFolder: contentActions.resetSectionFolder,
    openManageFoldersDialog: contentActions.openManageFoldersDialog,
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

    return [{
      title: 'Google Document',
      icon: icons.docs,
      handler: () => actions.onCreateRemoteContent({
        title: 'Create Document',
        driver: 'drive',
        form: 'drive.document',
        parentId: defaultFolderId//ghostFolder.id,
      })
    }, {
      title: 'Google Folder',
      icon: icons.folder,
      handler: () => actions.onCreateRemoteContent({
        title: 'Create Folder',
        driver: 'drive',
        form: 'drive.folder',
        parentId: defaultFolderId//ghostFolder.id,
      })
    }, linkItem]
  }, [
    defaultFolderId,
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

      // ghostFolder ? {
      //   title: 'View in Drive',
      //   icon: icons.open,
      //   url: driveUtils.getItemUrl(ghostFolder),
      // } : null,

      // ghostFolder ? {
      //   title: 'Change Drive Folder',
      //   icon: icons.search,
      //   handler: () => actions.onChangeSectionFolder({
      //     id: section,
      //   })
      // } : null,

      // ghostFolder && !isDefaultFolder ? {
      //   title: 'Reset Drive Folder',
      //   icon: icons.refresh,
      //   handler: () => actions.onResetSectionFolder({
      //     id: section,
      //   })
      // } : null,

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