import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Actions from '../../utils/actions'
import contentActions from '../../store/modules/content'

import icons from '../../icons'
import driveUtils from '../../utils/drive'

import useSection from './useSection'
import useLayoutEditor from './useLayoutEditor'

import settingsSelectors from '../../store/selectors/settings'

const useSectionEditor = ({
  section,
  content_id,
  layout_id,
  withWidgets,
}) => {

  const {
    node,
    annotation,
    addTargetFolderId,
  } = useSection({
    section,
  })

  const layoutEditor = useLayoutEditor({
    content_id,
    layout_id
  })

  const actions = Actions(useDispatch(), {
    onCreateRemoteContent: contentActions.createRemoteContent,
    onCreateLocalContent: contentActions.createLocalContent,
    onAddRemoteContent: contentActions.addRemoteContent,
    onEditSection: contentActions.editSection,
    openManageFoldersDialog: contentActions.openManageFoldersDialog,
  })

  const getAddItems = useCallback(() => {

    const newDocumentHandler = () => actions.onCreateRemoteContent({
      title: 'Create Document',
      driver: 'drive',
      form: 'drive.document',
      parentId: addTargetFolderId,
    })

    const existingDocumentHandler = () => actions.onAddRemoteContent({
      section,
      type: 'document',
    })

    const newFolderHandler = () => actions.onCreateRemoteContent({
      title: 'Create Folder',
      driver: 'drive',
      form: 'drive.folder',
      parentId: addTargetFolderId,
    })

    const existingFolderHandler = () => actions.onAddRemoteContent({
      section,
      type: 'folder',
    })

    return [
      {
        title: 'New Google Document',
        icon: icons.docs,
        handler: newDocumentHandler,
      },
      {
        title: 'New Google Folder',
        icon: icons.folder,
        handler: newFolderHandler,
      },
      {
        title: 'Import Existing Drive Content',
        icon: icons.drive,
        items: [
          {
            title: 'Existing Google Document',
            icon: icons.docs,
            secondaryIcon: icons.search,
            handler: existingDocumentHandler,
          },
          {
            title: 'Existing Google Folder',
            icon: icons.folder,
            secondaryIcon: icons.search,
            handler: existingFolderHandler,
          },
        ]
      },
      '-',
      {
        title: 'Link',
        icon: icons.link,
        handler: () => actions.onCreateLocalContent({
          title: 'Create Link',
          form: 'link',
          location: `section:${section}`,
        })
      },
      withWidgets ? {
        title: 'Widget',
        icon: icons.widget,
        items: layoutEditor.getAddMenu(),
      } : null,
    ].filter(i => i)
  }, [
    addTargetFolderId,
    withWidgets,
    layoutEditor.getAddMenu,
  ])
  
  const getSettingsItems = useCallback(() => {
    return [

      {
        title: 'Manage Drive Folders',
        icon: icons.folder,
        secondaryIcon: icons.drive,
        handler: () => actions.openManageFoldersDialog({
          section,
        })
      },

      '-',
      
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
  ])

  const getAllItems = useCallback(() => {
    return [

      {
        title: 'Add',
        icon: icons.add,
        items: getAddItems(),
      },

      {
        title: 'Settings',
        icon: icons.settings,
        handler: () => actions.onEditSection({
          title: `Edit Section`,
          form: `section`,
          id: section,
        })
      },


    ].filter(i => i)
  }, [
    section,
    getAddItems,
  ])
  
  return {
    node,
    annotation,
    getAddItems,
    getSettingsItems,
    getAllItems,
  }
}

export default useSectionEditor